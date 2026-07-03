// src/app/api/support/chat/route.ts
// Server-side API route — HF key never exposed to client

import { NextRequest, NextResponse } from 'next/server';
import { retrieveRelevantDocs, buildContext, buildSystemPrompt, isOutOfScope } from '@/features/support/services/ragService';
import { ChatRequest, ChatResponse, KnowledgeItem } from '@/features/support/types';

const HF_API_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen3-8B-Instruct/v1/chat/completions';
const HF_API_KEY = process.env.HF_API_KEY;

// Simple in-memory rate limiting map (IP -> { count, resetTime })
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 20; // Max 20 requests per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // per 1 minute

export async function POST(req: NextRequest) {
  // 1. Basic Origin / Referer validation for security
  const referer = req.headers.get('referer') || req.headers.get('origin');
  if (referer && !referer.includes('localhost') && !referer.includes('masarak.com')) {
    return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
  }

  // 2. Simple Rate Limiting by IP
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  if (ip !== 'unknown') {
    const record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
      if (record.count >= RATE_LIMIT_MAX) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
      record.count += 1;
    }
  }

  let retrievedDocs: KnowledgeItem[] = [];

  try {
    const body: ChatRequest = await req.json();
    const { message, conversationHistory = [], userContext } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Step 1: Retrieve relevant documents (RAG)
    retrievedDocs = retrieveRelevantDocs(message, 3);
    const context = buildContext(retrievedDocs);
    const outOfScope = isOutOfScope(message, retrievedDocs);

    // Step 2: Build prompt
    const systemPrompt = buildSystemPrompt(context, userContext);

    // Step 3: Prepare messages for the LLM
    const messages = [
      { role: 'system', content: systemPrompt },
      // Include last 4 messages of history for context
      ...conversationHistory.slice(-4).map(m => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    // Step 4: Call HF API
    let answer = '';
    let shouldEscalate = false;

    if (!HF_API_KEY) {
      // Fallback mode: use RAG results directly when no API key
      if (retrievedDocs.length > 0) {
        answer = retrievedDocs[0].answer;
      } else {
        answer = 'للأسف مش عارف الإجابة دي. هحولك لفريق الدعم.';
        shouldEscalate = true;
      }
    } else {
      const hfResponse = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen3-8B-Instruct',
          messages,
          max_tokens: 300,
          temperature: 0.3,
          stream: false,
        }),
      });

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        console.error('HF API error:', hfResponse.status, errorText);

        // Graceful degradation: use RAG results directly
        if (retrievedDocs.length > 0) {
          answer = retrievedDocs[0].answer;
        } else {
          answer = 'حصل خطأ تقني مؤقت. جرب تاني أو تواصل مع الدعم.';
          shouldEscalate = true;
        }
      } else {
        const data = await hfResponse.json();
        answer = data.choices?.[0]?.message?.content?.trim() ?? '';

        if (!answer) {
          answer = retrievedDocs.length > 0
            ? retrievedDocs[0].answer
            : 'للأسف مش عارف الإجابة دي. هحولك لفريق الدعم.';
        }
      }
    }

    // Step 5: Detect escalation signals
    const escalationPhrases = [
      'هحولك', 'تواصل مع', 'فريق الدعم', 'خارج نطاق', 'مش عارف', 'مش بعرف',
    ];
    shouldEscalate = shouldEscalate || escalationPhrases.some(p => answer.includes(p));

    const response: ChatResponse = {
      answer,
      shouldEscalate,
      retrievedDocs: retrievedDocs.map(d => ({
        ...d,
        // Don't expose internal IDs unnecessarily in production
        answer: d.answer,
      })),
      confidence: retrievedDocs.length > 0 ? Math.min(retrievedDocs.length / 3, 1) : 0,
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Support chat error:', error);
    
    // Graceful degradation on network error
    if (retrievedDocs.length > 0) {
      return NextResponse.json({
        answer: retrievedDocs[0].answer,
        shouldEscalate: false,
        retrievedDocs,
        confidence: Math.min(retrievedDocs.length / 3, 1),
      });
    }

    return NextResponse.json(
      {
        answer: 'واجهنا مشكلة في الاتصال. لكن يمكنك التواصل مع الدعم مباشرةً.',
        shouldEscalate: true,
        retrievedDocs: [],
        confidence: 0,
      },
      { status: 200 } // Return 200 so UI doesn't crash
    );
  }
}
