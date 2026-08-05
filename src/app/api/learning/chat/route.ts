// src/app/api/learning/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, lessonTitle, courseTitle, history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'الرجاء إدخال سؤالك.' }, { status: 400 });
    }

    if (!NVIDIA_API_KEY) {
      return NextResponse.json({ error: 'مفتاح الذكاء الاصطناعي غير متوفر.' }, { status: 500 });
    }

    const systemInstruction = `أنت مساعد تعليمي ذكي في منصة "مسارك" للثانوية العامة.
أنت الآن تساعد طالباً يدرس كورس "${courseTitle || 'غير محدد'}"، وهو حالياً في درس بعنوان "${lessonTitle || 'غير محدد'}".
مهمتك هي الإجابة على أسئلة الطالب العلمية حول هذا الدرس بأسلوب مبسط، مشجع، وباللهجة المصرية العامية.

قواعد هامة جداً للرد:
1. استخدم اللغة العربية الفصحى للمصطلحات العلمية (مثل: المقاومة، الجهد، شدة التيار) وتجنب تماماً استخدام أي كلمات روسية أو لغات أخرى غير مفهومة للطالب المصري.
2. عند كتابة أي معادلة رياضية أو كسور أو أرقام علمية، **يجب** استخدام تنسيق LaTeX الصحيح.
3. للمعادلات المستقلة في سطر منفصل، استخدم علامتي الدولار المزدوجة هكذا:
$$
\\\\\frac{V}{I} = R
$$
4. للمعادلات داخل الكلام، استخدم علامة دولار مفردة هكذا: $V=IR$.
5. لا تقم أبداً بكتابة الكسور على هيئة نصوص مثل "1 / R = 1 / 2" بل استخدم LaTeX دائماً $\\\\\frac{1}{R} = \\\\\frac{1}{2}$.
6. نظم إجابتك باستخدام Markdown (عناوين، قوائم، وغيرها).`;

    const historyMessages = history.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const finalMessages = [
      { role: 'system', content: systemInstruction },
      ...historyMessages,
    ];

    const lastMsg = historyMessages[historyMessages.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== message) {
      finalMessages.push({ role: 'user', content: message });
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: finalMessages,
        temperature: 0.5,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Learning Chat API Error:', response.status, errText);
      return NextResponse.json(
        { error: 'حدث خطأ في الاتصال بالمساعد الذكي.' },
        { status: 500 }
      );
    }

    const responseData = await response.json();
    const answer = responseData.choices?.[0]?.message?.content || '';

    if (!answer) {
      return NextResponse.json({ error: 'لم أتمكن من استنتاج إجابة.' }, { status: 500 });
    }

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Learning Chat API Exception:', error);
    return NextResponse.json({ error: 'خطأ غير متوقع.' }, { status: 500 });
  }
}
