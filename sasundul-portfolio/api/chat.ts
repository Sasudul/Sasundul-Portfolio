// ═══════════════════════════════════════════════════════════════════
// VERCEL EDGE SERVERLESS FUNCTION — /api/chat
// Securely proxies Gemini API requests. Hides API key from browser.
// ═══════════════════════════════════════════════════════════════════

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '../components/aiPersona';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Read API key securely from server-side environment variables
  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not set in Vercel environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { message, contents } = await req.json();

    if (!message && (!contents || contents.length === 0)) {
      return new Response(JSON.stringify({ error: 'Message payload missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Model fallback chain: gemini-2.0-flash -> gemini-1.5-flash -> gemini-2.5-flash
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];
    let responseStream: any = null;
    let lastError: any = null;

    const apiContents = contents || [{ role: 'user', parts: [{ text: message }] }];

    for (const modelName of modelsToTry) {
      try {
        responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents: apiContents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.75,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        });
        if (responseStream) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!responseStream) {
      throw lastError || new Error('All Gemini models failed');
    }

    // Stream text back to the browser using ReadableStream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('[Vercel Serverless AI Error]:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
