// ═══════════════════════════════════════════════════════════════════
// VERCEL SERVERLESS FUNCTION — /api/chat
// Securely proxies Gemini API requests. Hides API key from browser.
// ═══════════════════════════════════════════════════════════════════

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from '../components/aiPersona';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    if (res.status) return res.status(405).json({ error: 'Method Not Allowed' });
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  // Check all possible environment variable name variations
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.REACT_APP_GEMINI_API_KEY ||
    ''
  ).trim();

  if (!apiKey) {
    const errorMsg = 'GEMINI_API_KEY environment variable was not found in Vercel. Check Vercel Settings -> Environment Variables.';
    if (res.status) return res.status(500).json({ error: errorMsg });
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500 });
  }

  try {
    let body = req.body;
    if (typeof req.json === 'function') {
      try { body = await req.json(); } catch {}
    } else if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }

    const { message, contents } = body || {};

    if (!message && (!contents || contents.length === 0)) {
      const err = 'Message payload missing';
      if (res.status) return res.status(400).json({ error: err });
      return new Response(JSON.stringify({ error: err }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });
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

    // Node Serverless Response
    if (res.setHeader && typeof res.write === 'function') {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');

      for await (const chunk of responseStream) {
        if (chunk.text) res.write(chunk.text);
      }
      return res.end();
    }

    // Edge ReadableStream Response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
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
    const errorText = error?.message || 'Internal Server Error';
    if (res.status && !res.headersSent) {
      return res.status(500).json({ error: errorText });
    }
    return new Response(JSON.stringify({ error: errorText }), { status: 500 });
  }
}
