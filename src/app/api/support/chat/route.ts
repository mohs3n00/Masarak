// src/app/api/support/chat/route.ts
// Server-side API route for AI Support Chat

import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, retrieveRelevantDocs, buildPersonaPrompt, buildKnowledgePrompt } from '@/features/support/services/ragService';
import { ChatRequest, ChatResponse, KnowledgeItem } from '@/features/support/types';

const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';


// Simple in-memory rate limiting map (IP -> { count, resetTime })
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 15; // Max 15 requests per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // per 1 minute

// In-memory lightweight retrieval cache scoped to this serverless instance
const retrievalCache = new Map<string, { docs: KnowledgeItem[], timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let debugInfo: ChatResponse['debugInfo'] = {
    provider: AI_PROVIDER === 'openrouter' ? 'OpenRouter' : 'Fallback',
    model: OPENROUTER_MODEL,
    responseTime: 0,
    status: 'Connected',
  };

  // 1. Basic Origin / Referer validation for security
  const referer = req.headers.get('referer') || req.headers.get('origin');
  if (referer && !referer.includes('localhost') && !referer.includes('masarak.com') && !referer.includes('vercel.app')) {
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

    const reqId = Math.random().toString(36).substring(7);
    const isDebug = process.env.DEBUG_AI === 'true';

    // Step 1: Intent Detection
    const intent = detectIntent(message);

    // Step 2: Retrieve relevant documents (RAG) ONLY if PLATFORM_QUERY
    if (intent === 'PLATFORM_QUERY') {
      const normalizedQuery = message.trim().toLowerCase();
      const cached = retrievalCache.get(normalizedQuery);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp < CACHE_TTL)) {
        retrievedDocs = cached.docs;
      } else {
        retrievedDocs = retrieveRelevantDocs(message, 3).map(r => r.doc);
        retrievalCache.set(normalizedQuery, { docs: retrievedDocs, timestamp: now });
      }
    }

    // Step 3: Build Prompts
    const personaPrompt = buildPersonaPrompt(userContext);
    const knowledgePrompt = buildKnowledgePrompt(retrievedDocs);
    const systemInstruction = knowledgePrompt ? `${personaPrompt}\n\n${knowledgePrompt}` : personaPrompt;

    // Production Logging
    console.log(`[AI_${reqId}] Time: ${new Date().toISOString()} | Intent: ${intent} | RAG: ${retrievedDocs.length > 0}`);
    if (isDebug) {
      console.log(`[AI_${reqId}] 📝 USER MESSAGE:`, message);
      console.log(`[AI_${reqId}] 📚 RAG DOCS:`, retrievedDocs.map(d => d.question));
      console.log(`[AI_${reqId}] ⚙️ SYSTEM PROMPT:\n`, systemInstruction);
    }

    // Step 4: Call AI API
    let answer = '';
    let shouldEscalate = false;
    let fallbackUsed = false;

    if (AI_PROVIDER === 'openrouter' && !OPENROUTER_API_KEY) {
      debugInfo.status = 'Using Fallback';
      debugInfo.error = 'OPENROUTER_API_KEY is not configured.';
      
      if (retrievedDocs.length > 0) {
        answer = retrievedDocs[0].answer;
        fallbackUsed = true;
      } else {
        answer = 'للأسف مش عارف الإجابة دي. هحولك لفريق الدعم.';
        shouldEscalate = true;
      }
    } else if (AI_PROVIDER === 'openrouter') {
      try {
        const historyContents = conversationHistory.slice(-4).map(m => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content
        }));

        const finalMessages = [
          { role: 'system' as const, content: systemInstruction },
          ...historyContents,
          { role: 'user' as const, content: message }
        ];

        const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://masarak.com',
            'X-Title': 'Masarak AI Support',
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: finalMessages,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (!openRouterResponse.ok) {
          const errText = await openRouterResponse.text();
          throw new Error(`OpenRouter API error: ${openRouterResponse.status} ${errText}`);
        }

        const responseData = await openRouterResponse.json();

        if (isDebug) {
          console.log(`[AI_${reqId}] 🤖 RAW API RESPONSE:`, JSON.stringify(responseData, null, 2));
        }

        answer = responseData.choices?.[0]?.message?.content || '';

        if (!answer) {
          throw new Error('Empty response from AI');
        }
      } catch (aiError: any) {
        console.error(`[AI_${reqId}] ❌ API Error:`, aiError.message);
        debugInfo.status = 'API Error';
        debugInfo.error = aiError.message || 'Unknown API Error';
        
        // Graceful degradation: use RAG results directly ONLY on complete API failure
        if (retrievedDocs.length > 0) {
          answer = retrievedDocs[0].answer;
          fallbackUsed = true;
          console.log(`[AI_${reqId}] ⚠️ FALLBACK TRIGGERED`);
        } else if (intent === 'CONVERSATIONAL') {
          answer = 'أهلاً بك يا بطل! أنا مساعد مسارك الذكي، إزاي أقدر أساعدك النهاردة؟';
          fallbackUsed = true;
        } else {
          answer = 'حصل خطأ تقني مؤقت ومقدرتش أوصل للذكاء الاصطناعي. هحولك للدعم أو تقدر تستنى شوية وتجرب تاني.';
          shouldEscalate = true;
        }
      }
    } else {
      answer = 'مزود الذكاء الاصطناعي غير مدعوم حالياً.';
      shouldEscalate = true;
    }

    // Step 5: Detect escalation signals
    const escalationPhrases = [
      'هحولك', 'تواصل مع', 'فريق الدعم', 'خارج نطاق', 'مش عارف', 'مش بعرف', 'أعتذر جداً عن المشكلة', 'أحد ممثلي خدمة العملاء'
    ];
    shouldEscalate = shouldEscalate || escalationPhrases.some(p => answer.includes(p));

    const latency = Date.now() - startTime;
    debugInfo.responseTime = latency;

    console.log(`[AI_${reqId}] Latency: ${latency}ms | Fallback: ${fallbackUsed} | Escalate: ${shouldEscalate}`);

    const responsePayload: ChatResponse = {
      answer,
      shouldEscalate,
      retrievedDocs: retrievedDocs.map(d => ({
        ...d,
        answer: d.answer,
      })),
      confidence: retrievedDocs.length > 0 ? Math.min(retrievedDocs.length / 3, 1) : 0,
      debugInfo: process.env.NODE_ENV === 'development' ? debugInfo : undefined,
    };

    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error('Support chat outer error:', error);
    
    debugInfo.status = 'API Error';
    debugInfo.error = error.message;
    debugInfo.responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        answer: 'واجهنا مشكلة في الاتصال. يمكنك المحاولة لاحقاً أو التواصل مع الدعم مباشرةً.',
        shouldEscalate: true,
        retrievedDocs: [],
        confidence: 0,
        debugInfo: process.env.NODE_ENV === 'development' ? debugInfo : undefined,
      },
      { status: 500 }
    );
  }
}
