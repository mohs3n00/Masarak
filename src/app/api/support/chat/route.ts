// src/app/api/support/chat/route.ts
// Server-side API route for AI Support Chat

import { NextRequest, NextResponse } from 'next/server';
import { retrieveRelevantDocs, buildContext, buildSystemPrompt, isOutOfScope } from '@/features/support/services/ragService';
import { ChatRequest, ChatResponse, KnowledgeItem } from '@/features/support/types';
import { HfInference } from '@huggingface/inference';

const HF_API_KEY = process.env.HF_API_KEY;

// Simple in-memory rate limiting map (IP -> { count, resetTime })
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 15; // Max 15 requests per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // per 1 minute

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let debugInfo: ChatResponse['debugInfo'] = {
    provider: 'Hugging Face',
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
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

    // Step 1: Retrieve relevant documents (RAG)
    retrievedDocs = retrieveRelevantDocs(message, 3);
    const context = buildContext(retrievedDocs);
    const outOfScope = isOutOfScope(message, retrievedDocs);

    // Step 2: Build system prompt
    const systemInstruction = buildSystemPrompt(context, userContext);

    // Step 3: Call AI API
    let answer = '';
    let shouldEscalate = false;

    if (!HF_API_KEY) {
      // Fallback mode
      debugInfo.status = 'Using Fallback';
      debugInfo.error = 'HF_API_KEY is not configured.';
      
      if (retrievedDocs.length > 0) {
        answer = retrievedDocs[0].answer;
      } else {
        answer = 'للأسف مش عارف الإجابة دي. هحولك لفريق الدعم.';
        shouldEscalate = true;
      }
    } else {
      const hf = new HfInference(HF_API_KEY);
      
      try {
        // Map conversation history to Hugging Face format
        const historyContents = conversationHistory.slice(-4).map(m => ({
          role: m.role,
          content: m.content
        }));

        const response = await hf.chatCompletion({
          model: 'meta-llama/Meta-Llama-3-8B-Instruct',
          messages: [
            { role: 'system', content: systemInstruction },
            ...historyContents,
            { role: 'user', content: message }
          ],
          temperature: 0.2, // Keep it deterministic and factual
          max_tokens: 400, // Limit response length
        });

        answer = response.choices[0].message.content || '';

        if (!answer) {
          throw new Error('Empty response from AI');
        }
      } catch (aiError: any) {
        console.error('Hugging Face API Error:', aiError);
        debugInfo.status = 'API Error';
        debugInfo.error = aiError.message || 'Unknown API Error';
        
        // Graceful degradation: use RAG results directly
        if (retrievedDocs.length > 0) {
          answer = retrievedDocs[0].answer;
        } else {
          answer = 'حصل خطأ تقني مؤقت ومقدرتش أوصل للذكاء الاصطناعي. هحولك للدعم أو تقدر تستنى شوية وتجرب تاني.';
          shouldEscalate = true;
        }
      }
    }

    // Step 4: Detect escalation signals
    const escalationPhrases = [
      'هحولك', 'تواصل مع', 'فريق الدعم', 'خارج نطاق', 'مش عارف', 'مش بعرف', 'أعتذر جداً عن المشكلة', 'أحد ممثلي خدمة العملاء'
    ];
    shouldEscalate = shouldEscalate || escalationPhrases.some(p => answer.includes(p));

    debugInfo.responseTime = Date.now() - startTime;

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
