// src/app/api/community/chat/route.ts
// Community AI Chat - Powered by NVIDIA NIM

import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    if (ip !== 'unknown') {
      const record = rateLimitMap.get(ip);
      if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      } else {
        if (record.count >= RATE_LIMIT_MAX) {
          return NextResponse.json(
            { error: 'عذراً، لقد تجاوزت الحد المسموح به من الأسئلة. حاول مرة أخرى بعد قليل.' },
            { status: 429 }
          );
        }
        record.count += 1;
      }
    }

    const body = await req.json();
    const { message, communitySlug, communityCategory } = body;

    if (!message) {
      return NextResponse.json({ error: 'يرجى كتابة سؤال أولاً' }, { status: 400 });
    }

    if (!NVIDIA_API_KEY) {
      return NextResponse.json({ error: 'مفتاح الذكاء الاصطناعي غير متوفر.' }, { status: 500 });
    }

    const systemInstruction = `أنت مساعد أكاديمي وذكي في منصة "مسارك" التعليمية للثانوية العامة بمصر.
أنت الآن متواجد في مجتمع مادة/تصنيف: "${communityCategory || communitySlug || 'عام'}".
مهمتك إجابة أسئلة الطلاب بأسلوب بسيط، دقيق، وباللهجة المصرية العامية.

قواعد هامة جداً للرد:
1. استخدم اللغة العربية الفصحى للمصطلحات العلمية وتجنب تماماً استخدام أي كلمات روسية أو لغات أجنبية غير مبررة (مثل "сопротивلة" وغيرها).
2. عند كتابة أي معادلة رياضية أو كسور أو أرقام علمية، **يجب** استخدام تنسيق LaTeX الصحيح.
3. للمعادلات المستقلة في سطر منفصل، استخدم علامتي الدولار المزدوجة هكذا:
$$
\\\frac{V}{I} = R
$$
4. للمعادلات داخل الكلام، استخدم علامة دولار مفردة هكذا: $V=IR$.
5. لا تقم أبداً بكتابة الكسور على هيئة نصوص مثل "1 / R = 1 / 2" بل استخدم LaTeX دائماً $\\\frac{1}{R} = \\\frac{1}{2}$.
6. استخدم أسلوب Markdown في التنسيق وضع القوانين داخل بلوكات واضحة.
إذا كان السؤال خارج نطاق الدراسة، اطلب بلطف التوجيه للمادة.`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('NVIDIA API error:', response.status, errText);
      return NextResponse.json(
        { error: 'فشل في الاتصال بالمساعد الذكي، حاول مرة أخرى.' },
        { status: 500 }
      );
    }

    const responseData = await response.json();
    const answer = responseData.choices?.[0]?.message?.content || '';

    if (!answer) {
      return NextResponse.json(
        { error: 'لم أتمكن من إيجاد إجابة مناسبة، حاول توضيح سؤالك.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer });

  } catch (error: any) {
    console.error('Community AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء معالجة طلبك.' },
      { status: 500 }
    );
  }
}
