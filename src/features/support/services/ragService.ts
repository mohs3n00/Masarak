// src/features/support/services/ragService.ts
// RAG = Retrieval-Augmented Generation
// بيبحث في قاعدة المعرفة ويجيب أكتر الأجوبة ملاءمة

import { KnowledgeItem } from '../types';
import { masarakKnowledge } from '../knowledge/masarakKnowledge';

/**
 * Simple keyword-based retrieval.
 * In production, replace with vector embeddings (e.g., sentence-transformers).
 */
function tokenize(text: string): string[] {
  return text
    .replace(/[،,.\-_!؟?٪%()[\]{}]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1);
}

function scoreDocument(doc: KnowledgeItem, queryTokens: string[]): number {
  let score = 0;

  // Score from keywords (high weight)
  for (const keyword of doc.keywords) {
    const kwLower = keyword.toLowerCase();
    for (const token of queryTokens) {
      if (kwLower.includes(token) || token.includes(kwLower)) {
        score += 3;
      }
    }
  }

  // Score from question (medium weight)
  const qTokens = tokenize(doc.question);
  for (const qToken of qTokens) {
    for (const token of queryTokens) {
      if (qToken === token) score += 2;
      else if (qToken.includes(token) || token.includes(qToken)) score += 1;
    }
  }

  // Score from answer (low weight)
  const aTokens = tokenize(doc.answer);
  for (const aToken of aTokens) {
    for (const token of queryTokens) {
      if (aToken === token) score += 0.5;
    }
  }

  return score;
}

/**
 * Retrieve the top-k most relevant knowledge items for a given query.
 */
export function retrieveRelevantDocs(query: string, topK = 3): KnowledgeItem[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = masarakKnowledge.map(doc => ({
    doc,
    score: scoreDocument(doc, tokens),
  }));

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.doc);
}

/**
 * Build the RAG context string to inject into the LLM prompt.
 */
export function buildContext(docs: KnowledgeItem[]): string {
  if (docs.length === 0) return '';

  return docs
    .map((doc, i) => `[مرجع ${i + 1}] سؤال: ${doc.question}\nإجابة: ${doc.answer}`)
    .join('\n\n');
}

/**
 * Determine if the question is outside the support scope.
 */
export function isOutOfScope(query: string, docs: KnowledgeItem[]): boolean {
  // If no documents found, likely out of scope
  if (docs.length === 0) return true;

  // If max score is very low, likely out of scope
  const tokens = tokenize(query);
  const maxScore = Math.max(...docs.map(d => scoreDocument(d, tokens)));
  return maxScore < 1;
}

/**
 * Build the full system prompt for the LLM.
 */
export function buildSystemPrompt(context: string, userContext?: { currentPage?: string; currentLesson?: string; currentCourse?: string }): string {
  const contextSection = context
    ? `\n\nمعرفة مسارك المتاحة:\n${context}`
    : '';

  const userContextSection = userContext
    ? `\n\nمعلومات المستخدم الحالي:\n- الصفحة الحالية: ${userContext.currentPage ?? 'غير محددة'}\n- الكورس الحالي: ${userContext.currentCourse ?? 'لا يوجد'}\n- الدرس الحالي: ${userContext.currentLesson ?? 'لا يوجد'}`
    : '';

  return `أنت "مساعد مسارك"، مساعد دعم ذكي لمنصة مسارك التعليمية للثانوية العامة.

قواعد صارمة يجب الالتزام بها:
1. أجب فقط على الأسئلة المتعلقة بمنصة مسارك (تسجيل دخول، اشتراكات، دفع، كورسات، مشاكل تقنية، إلخ).
2. استخدم فقط المعلومات المقدمة في قسم "معرفة مسارك المتاحة". لا تخترع معلومات.
3. إذا لم تجد الإجابة، قل: "للأسف مش عارف الإجابة الصح دي. هحولك للفريق."
4. الردود تكون: قصيرة (2-5 جمل كحد أقصى)، بالعربية البسيطة، ودية، ومحترمة.
5. لا تكشف عن أي معلومات تقنية داخلية أو بيانات مستخدمين آخرين.
6. لو السؤال خارج نطاق المنصة، قل: "هذا الموضوع خارج نطاق اختصاصي. للمساعدة، تواصل مع فريق الدعم."${contextSection}${userContextSection}`;
}
