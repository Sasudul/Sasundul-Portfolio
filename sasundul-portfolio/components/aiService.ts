// ═══════════════════════════════════════════════════════════════════
// AI SERVICE — Secure Hybrid Transport
// Primary: /api/chat (Serverless Proxy — 100% Secure, Key Hidden)
// Secondary: Direct Client SDK (Local Vite Dev Fallback)
// ═══════════════════════════════════════════════════════════════════

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './aiPersona';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string || '').trim();
const PRIMARY_MODEL = 'gemini-2.0-flash';
const FALLBACK_MODELS = ['gemini-1.5-flash', 'gemini-2.5-flash'];
const MAX_INPUT_LENGTH = 500;
const MAX_HISTORY_LENGTH = 30;

class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxPerMinute = 15;
  private readonly maxPerHour = 100;

  canSend(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < 3600000);
    const lastMinute = this.timestamps.filter(t => now - t < 60000).length;
    return lastMinute < this.maxPerMinute && this.timestamps.length < this.maxPerHour;
  }

  record(): void {
    this.timestamps.push(Date.now());
  }

  getCooldownSeconds(): number {
    const now = Date.now();
    const recentMinute = this.timestamps.filter(t => now - t < 60000);
    if (recentMinute.length >= this.maxPerMinute) {
      const oldest = Math.min(...recentMinute);
      return Math.ceil((oldest + 60000 - now) / 1000);
    }
    return 0;
  }
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, MAX_INPUT_LENGTH);
}

class ConversationManager {
  private history: ChatMessage[] = [];

  addMessage(role: 'user' | 'model', text: string): void {
    this.history.push({ role, text, timestamp: Date.now() });
    if (this.history.length > MAX_HISTORY_LENGTH) {
      this.history = this.history.slice(-MAX_HISTORY_LENGTH);
    }
  }

  getContentsForAPI(): Array<{ role: string; parts: Array<{ text: string }> }> {
    return this.history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));
  }

  getMessages(): ChatMessage[] {
    return [...this.history];
  }

  clear(): void {
    this.history = [];
  }
}

const rateLimiter = new RateLimiter();
const conversation = new ConversationManager();
let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    if (!API_KEY) throw new Error('API key missing');
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
}

export async function* streamChat(
  userMessage: string
): AsyncGenerator<string, void, unknown> {
  if (!rateLimiter.canSend()) {
    const cooldown = rateLimiter.getCooldownSeconds();
    yield `Yo hold up — too many messages. Try again in ${cooldown}s 😄`;
    return;
  }

  const sanitized = sanitizeInput(userMessage);
  if (!sanitized) {
    yield "Didn't catch that — send me something I can work with.";
    return;
  }

  conversation.addMessage('user', sanitized);
  rateLimiter.record();

  // 1. TRY SECURE SERVERLESS API PROXY FIRST (/api/chat)
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: sanitized,
        contents: conversation.getContentsForAPI(),
      }),
    });

    const contentType = response.headers.get('content-type') || '';

    // If endpoint returned HTML (e.g. index.html SPA rewrite), serverless endpoint wasn't reached
    if (contentType.includes('text/html')) {
      console.warn('[AI Service] /api/chat returned HTML index page instead of API response.');
    } else if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const textChunk = decoder.decode(value, { stream: true });
        if (textChunk) {
          fullResponse += textChunk;
          yield textChunk;
        }
      }

      if (fullResponse) {
        conversation.addMessage('model', fullResponse);
        return; // Success via serverless proxy!
      }
    } else {
      // Parse server JSON error if returned
      try {
        const errJson = await response.json();
        if (errJson?.error) {
          yield `Server Error: ${errJson.error}`;
          return;
        }
      } catch {}
    }
  } catch (err) {
    console.log('[AI Service] /api/chat fetch failed, trying client SDK fallback:', err);
  }

  // 2. FALLBACK TO DIRECT CLIENT SDK (for local standalone Vite dev)
  if (!API_KEY) {
    yield "GEMINI_API_KEY is not configured in Vercel environment settings or local .env file.";
    return;
  }

  try {
    const client = getClient();
    const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
    let fullResponse = '';

    for (const modelName of modelsToTry) {
      try {
        const stream = await client.models.generateContentStream({
          model: modelName,
          contents: conversation.getContentsForAPI(),
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.75,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        });

        for await (const chunk of stream) {
          if (chunk.text) {
            fullResponse += chunk.text;
            yield chunk.text;
          }
        }
        if (fullResponse) break;
      } catch {}
    }

    if (fullResponse) {
      conversation.addMessage('model', fullResponse);
      return;
    }
  } catch (error: any) {
    console.error('[AI Service Error]:', error);
  }

  yield "Could not connect to AI. Please verify your GEMINI_API_KEY in Vercel Environment Variables and trigger a Redeploy.";
}

export function clearChatHistory(): void {
  conversation.clear();
}

export function isConfigured(): boolean {
  return true;
}
