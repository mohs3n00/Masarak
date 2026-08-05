import { NextRequest, NextResponse } from 'next/server';

const AI_PROVIDER = process.env.AI_PROVIDER || 'openrouter';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      // Fallback if no AI key
      const isQuestion = content.includes('؟') || content.includes('?') || content.includes('هل') || content.includes('ليه');
      return NextResponse.json({ type: isQuestion ? 'QUESTION' : 'DISCUSSION' });
    }

    const systemInstruction = `أنت مصنف نصوص ذكي. 
مهمتك هي قراءة النص الذي كتبه المستخدم وتصنيفه إلى فئة واحدة فقط من الفئات التالية باللغة الإنجليزية، وإرجاع الكلمة الإنجليزية فقط بدون أي إضافات:
- QUESTION: إذا كان النص يطرح سؤالاً أو يطلب مساعدة في حل مشكلة أو استفسار.
- RESOURCE: إذا كان النص يشارك رابطاً أو ملفاً أو ملخصاً أو مصدراً تعليمياً للآخرين.
- ANNOUNCEMENT: إذا كان النص يمثل إعلاناً إدارياً أو تنبيهاً هاماً للطلاب (عادة يبدأ بـ "هام جدا" أو "تنبيه").
- DISCUSSION: إذا كان النص مجرد رأي، أو نقاش عام، أو مشاركة أفكار لا تندرج تحت الفئات السابقة.

قم بالرد بكلمة واحدة فقط من الكلمات الأربعة أعلاه.`;

    const finalMessages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content }
    ];

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://masarak.tech',
        'X-Title': 'Masarak AI Post Classifier',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: finalMessages,
        temperature: 0.1, // Low temperature for deterministic classification
        max_tokens: 10,
      }),
    });

    if (!openRouterResponse.ok) {
      const isQuestion = content.includes('؟') || content.includes('?');
      return NextResponse.json({ type: isQuestion ? 'QUESTION' : 'DISCUSSION' });
    }

    const responseData = await openRouterResponse.json();
    let answer = responseData.choices?.[0]?.message?.content?.trim().toUpperCase() || '';

    // Validate the answer
    if (!['QUESTION', 'RESOURCE', 'ANNOUNCEMENT', 'DISCUSSION'].includes(answer)) {
      const isQuestion = content.includes('؟') || content.includes('?');
      answer = isQuestion ? 'QUESTION' : 'DISCUSSION';
    }

    return NextResponse.json({ type: answer });
  } catch (error: any) {
    console.error('Community AI Classification Error:', error);
    const isQuestion = false;
    return NextResponse.json({ type: 'DISCUSSION' });
  }
}
