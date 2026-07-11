// src/features/support/services/ragService.ts
// RAG = Retrieval-Augmented Generation
// Advanced Lexical Retrieval System for Masarak

import { KnowledgeItem } from '../types';
import { masarakKnowledge } from '../knowledge/masarakKnowledge';

// ─── Intent Detection ────────────────────────────────────────────────────────

const CONVERSATIONAL_PATTERNS = [
  /^ازيك/i, /^عامل ايه/i, /^صباح الخير/i, /^مساء الخير/i, /^شكرا/i, /^تسلم/i, 
  /^مين انت/i, /بترد ازاي/i, /بتشتغل ازاي/i, /^اخبارك/i, /^باي/i, /^سلام/i, 
  /^اهلا/i, /^مرحبا/i, /^هاي/i, /^هلا/i, /^شكر/i, /يعطيك العافية/i, /مين حضرتك/i
];

export function detectIntent(message: string): 'CONVERSATIONAL' | 'PLATFORM_QUERY' {
  const normalized = message.trim().replace(/[؟?!.,]/g, '');
  if (CONVERSATIONAL_PATTERNS.some(regex => regex.test(normalized))) {
    return 'CONVERSATIONAL';
  }
  return 'PLATFORM_QUERY';
}

// ─── Advanced Retrieval ──────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'في', 'من', 'على', 'الى', 'عن', 'مع', 'هل', 'كيف', 'متى', 'اين', 'لماذا', 
  'ماذا', 'ما', 'لو', 'يا', 'انا', 'انت', 'هو', 'هي', 'اللي', 'ازاي', 'عايز', 'اريد'
]);

function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '') // remove tashkeel
    .replace(/[،,.\-_!؟?٪%()[\]{}]/g, ' ')
    .toLowerCase();
}

function tokenize(text: string): string[] {
  return normalizeArabic(text)
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

function scoreDocument(doc: KnowledgeItem, queryTokens: string[], normalizedQuery: string): number {
  let score = 0;
  
  // Exact keyword match gets a massive boost
  for (const keyword of doc.keywords) {
    const normKeyword = normalizeArabic(keyword);
    const keywordTokens = tokenize(normKeyword);
    
    // exact phrase match
    if (normalizedQuery.includes(normKeyword)) {
      score += 15;
    } else {
      // partial token match
      for (const token of queryTokens) {
        if (keywordTokens.includes(token)) score += 5;
        else if (normKeyword.includes(token) || token.includes(normKeyword)) score += 2;
      }
    }
  }

  // Question match
  const qTokens = tokenize(doc.question);
  for (const qToken of qTokens) {
    if (queryTokens.includes(qToken)) score += 3;
  }

  return score;
}

const MIN_SIMILARITY_THRESHOLD = 8;

export function retrieveRelevantDocs(query: string, topK = 3): { doc: KnowledgeItem, score: number }[] {
  const normalizedQuery = normalizeArabic(query);
  const tokens = tokenize(query);
  
  if (tokens.length === 0) return [];

  const scored = masarakKnowledge.map(doc => ({
    doc,
    score: scoreDocument(doc, tokens, normalizedQuery),
  }));

  return scored
    .filter(s => s.score >= MIN_SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// ─── Prompts ─────────────────────────────────────────────────────────────────

export function buildPersonaPrompt(userContext?: { currentPage?: string; currentLesson?: string; currentCourse?: string }): string {
  const userContextSection = userContext
    ? `\n\nمعلومات الطالب الحالي:\n- الصفحة الحالية: ${userContext.currentPage ?? 'غير محددة'}\n- الكورس الحالي: ${userContext.currentCourse ?? 'لا يوجد'}\n- الدرس الحالي: ${userContext.currentLesson ?? 'لا يوجد'}`
    : '';

  return `أنت "مساعد مسارك الذكي"، ممثل الدعم الفني والمرشد التعليمي لمنصة "مسارك" (منصة تعليمية لطلاب الثانوية العامة في مصر).

شخصيتك:
- أنت تتحدث مع طلاب ثانوية عامة، فكن دائماً مشجعاً، ودوداً، وأخاً كبيراً لهم.
- تحدث بلهجة مصرية عامية بسيطة جداً وراقية.
- إجاباتك طبيعية، مختصرة، وتفاعلية (تجنب النسخ واللصق من التوثيقات).
- لا تبدأ ردودك بوصف المنصة أو فقرات محفوظة أبداً، إلا إذا سُئلت عن ذلك صراحة.

قواعد صارمة:
1. أجب فقط على الأسئلة المتعلقة بمنصة مسارك. أي أسئلة أخرى علمية أو سياسية اعتذر عنها بلطف.
2. تفاعل بذكاء وحوار طبيعي، إذا كان الطالب يلقي التحية أو يشكرك، بادله التحية بلطف واختصار.
3. إذا أُعطيت "معلومات مسارك المتاحة" في الرسائل، استخدمها كمرجع للحقائق ولكن أعد صياغتها بأسلوبك الطبيعي والمختصر.
4. إذا لم تعرف الإجابة، قل: "أعتذر جداً عن المشكلة دي. هحولك فوراً لأحد ممثلي خدمة العملاء علشان يساعدك أسرع."
${userContextSection}`;
}

export function buildKnowledgePrompt(docs: KnowledgeItem[]): string {
  if (docs.length === 0) return '';
  const context = docs.map((doc, i) => `[مرجع ${i + 1}] سؤال: ${doc.question}\nإجابة: ${doc.answer}`).join('\n\n');
  return `معلومات مسارك المتاحة (استخدمها لحل مشكلة الطالب ولكن بصياغتك الطبيعية):\n${context}`;
}
