// src/app/api/support/chat/route.ts
// Server-side API route for AI Support Chat - Powered by NVIDIA NIM

import { NextRequest, NextResponse } from 'next/server';
import { detectIntent, retrieveRelevantDocs, buildPersonaPrompt, buildKnowledgePrompt } from '@/features/support/services/ragService';
import { ChatRequest, ChatResponse, KnowledgeItem } from '@/features/support/types';

const PUTER_API_KEY = process.env.PUTER_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InYyIn0.eyJ0IjoidCIsInYiOiIyIiwidG9rZW5fdWlkIjoiYjFlOTRkYjYtYTJmZS00NWM1LTk5NzAtNGNmYWM0ZDFjZWFhIiwidXUiOiIyUHZ4ckI0YVFNaUROTEtpM202emNBPT0iLCJzdSI6IkFSbm9UbGNKVFlLcnFpUlB1WFNNbUE9PSIsImFpIjoiMlB2eHJCNGFRTWlETkxLaTNtNnpjQT09IiwiZnVsbF9hY2Nlc3MiOnRydWUsImlhdCI6MTc4NTg3NzYyOX0.Slwe5SqUH9Id8vBUFdV3I80z4hE3D74IaOv3XX_DBrM';
const AI_MODEL = 'gpt-4o-mini';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW = 60 * 1000;

const retrievalCache = new Map<string, { docs: KnowledgeItem[], timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let debugInfo: ChatResponse['debugInfo'] = {
    provider: 'Puter API',
    model: AI_MODEL,
    responseTime: 0,
    status: 'Connected',
  };

  const referer = req.headers.get('referer') || req.headers.get('origin');
  if (referer && !referer.includes('localhost') && !referer.includes('masarak.com') && !referer.includes('masarak.tech') && !referer.includes('vercel.app')) {
    return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
  }

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

    const intent = detectIntent(message);

    if (intent === 'PLATFORM_QUERY') {
      const normalizedQuery = message.trim().toLowerCase();
      const cached = retrievalCache.get(normalizedQuery);
      const nowMs = Date.now();

      if (cached && (nowMs - cached.timestamp < CACHE_TTL)) {
        retrievedDocs = cached.docs;
      } else {
        retrievedDocs = retrieveRelevantDocs(message, 3).map(r => r.doc);
        retrievalCache.set(normalizedQuery, { docs: retrievedDocs, timestamp: nowMs });
      }
    }

    const personaPrompt = buildPersonaPrompt(userContext);
    const knowledgePrompt = buildKnowledgePrompt(retrievedDocs);
    const systemInstruction = knowledgePrompt ? `${personaPrompt}\n\n${knowledgePrompt}` : personaPrompt;

    console.log(`[AI_${reqId}] Intent: ${intent} | RAG: ${retrievedDocs.length > 0}`);

    let answer = '';
    let shouldEscalate = false;
    let fallbackUsed = false;

    if (!PUTER_API_KEY) {
      debugInfo.status = 'Using Fallback';
      debugInfo.error = 'PUTER_API_KEY is not configured.';

      if (retrievedDocs.length > 0) {
        answer = retrievedDocs[0].answer;
        fallbackUsed = true;
      } else {
        answer = 'للأسف مش عارف الإجابة دي. هحولك لفريق الدعم.';
        shouldEscalate = true;
      }
    } else {
      try {
        // Build proper message history for multi-turn conversation
        const historyMessages = conversationHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

        // Ensure the last message is the current user message
        const finalMessages = [
          { role: 'system', content: systemInstruction },
          ...historyMessages,
        ];

        // If history doesn't end with current message, add it
        const lastMsg = historyMessages[historyMessages.length - 1];
        if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== message) {
          finalMessages.push({ role: 'user', content: message });
        }

        const response = await fetch('https://api.puter.com/puterai/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: finalMessages,
            temperature: 0.5,
            max_tokens: 512,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Puter API Error ${response.status}: ${errText}`);
        }

        const responseData = await response.json();
        answer = responseData.choices?.[0]?.message?.content || '';

        if (!answer) {
          throw new Error('Empty response from AI');
        }
      } catch (aiError: any) {
        console.error(`[AI_${reqId}] API Error:`, aiError.message);
        debugInfo.status = 'API Error';
        debugInfo.error = aiError.message || 'Unknown API Error';

        if (retrievedDocs.length > 0) {
          answer = retrievedDocs[0].answer;
          fallbackUsed = true;
        } else if (intent === 'CONVERSATIONAL') {
          answer = 'أهلاوً بك يا بطل! أنا مساعد مسارك الذكي، إزاي أقدر أساعدك النهاردة؟';
          fallbackUsed = true;
        } else {
          answer = 'حصل خطأ تقني مؤقت ومقدرتش أوصل للذكاء الاصطناعي. هحولك للدعم أو تقدر تستنى شوية وتجرب تاني.';
          shouldEscalate = true;
        }
      }
    }

    const escalationPhrases = ['هحولك', 'تواصل مع', 'فريق الدعم', 'خارج نطاق', 'مش عارف', 'مش بعرف'];
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