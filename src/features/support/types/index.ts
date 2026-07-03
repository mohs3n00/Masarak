// src/features/support/types/index.ts

export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'done' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  feedback?: 'helpful' | 'not_helpful';
  isEscalation?: boolean;
}

export interface KnowledgeItem {
  id: string;
  category: SupportCategory;
  question: string;
  answer: string;
  keywords: string[];
  priority?: number; // higher = more relevant
}

export type SupportCategory =
  | 'login'
  | 'registration'
  | 'password'
  | 'otp'
  | 'enrollment'
  | 'payment'
  | 'wallet'
  | 'coupon'
  | 'certificate'
  | 'homework'
  | 'quiz'
  | 'navigation'
  | 'video'
  | 'pdf'
  | 'download'
  | 'teacher'
  | 'policy'
  | 'refund'
  | 'technical'
  | 'account'
  | 'general';

export interface UserContext {
  userId?: string;
  userName?: string;
  currentPage?: string;
  currentCourse?: string;
  currentLesson?: string;
  language?: string;
  device?: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory: { role: MessageRole; content: string }[];
  userContext?: UserContext;
}

export interface ChatResponse {
  answer: string;
  shouldEscalate: boolean;
  retrievedDocs: KnowledgeItem[];
  confidence: number;
}

export interface SupportAnalytics {
  totalQuestions: number;
  unansweredQuestions: string[];
  escalations: number;
  helpfulCount: number;
  notHelpfulCount: number;
  topQuestions: { question: string; count: number }[];
}
