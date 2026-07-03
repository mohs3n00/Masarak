'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatRequest, ChatResponse, UserContext } from '../types';

const STORAGE_KEY = 'masarak_support_history';
const MAX_ESCALATION_ATTEMPTS = 2;

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function loadHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    // Restore Date objects
    return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  } catch {
    // ignore storage errors
  }
}

export function useSupportChat(userContext?: UserContext) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [escalationCount, setEscalationCount] = useState(0);
  const [showEscalation, setShowEscalation] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => {
      const updated = [...prev, msg];
      saveHistory(updated);
      return updated;
    });
  }, []);

  const updateMessage = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setMessages(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, ...patch } : m);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      status: 'done',
    };
    addMessage(userMsg);

    // Add placeholder for assistant
    const assistantId = generateId();
    const placeholderMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'sending',
    };
    addMessage(placeholderMsg);
    setIsLoading(true);

    abortRef.current = new AbortController();

    try {
      const requestBody: ChatRequest = {
        message: content.trim(),
        conversationHistory: messages
          .filter(m => m.status === 'done')
          .slice(-6)
          .map(m => ({ role: m.role, content: m.content })),
        userContext,
      };

      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: abortRef.current.signal,
      });

      const data: ChatResponse = await res.json();

      updateMessage(assistantId, {
        content: data.answer,
        status: 'done',
        isEscalation: data.shouldEscalate,
      });

      if (data.shouldEscalate) {
        setEscalationCount(prev => {
          const next = prev + 1;
          if (next >= MAX_ESCALATION_ATTEMPTS) {
            setShowEscalation(true);
          }
          return next;
        });
      }

      // Track analytics
      trackQuestion(content, data.answer, data.shouldEscalate);

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;

      updateMessage(assistantId, {
        content: 'حصل خطأ. جرب مرة تانية.',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, userContext, addMessage, updateMessage]);

  const giveFeedback = useCallback((messageId: string, feedback: 'helpful' | 'not_helpful') => {
    updateMessage(messageId, { feedback });
    // Track feedback
    try {
      const analytics = JSON.parse(localStorage.getItem('masarak_support_analytics') ?? '{}');
      if (feedback === 'helpful') analytics.helpful = (analytics.helpful ?? 0) + 1;
      else analytics.not_helpful = (analytics.not_helpful ?? 0) + 1;
      localStorage.setItem('masarak_support_analytics', JSON.stringify(analytics));
    } catch { /* ignore */ }
  }, [updateMessage]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setEscalationCount(0);
    setShowEscalation(false);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    showEscalation,
    sendMessage,
    giveFeedback,
    clearHistory,
  };
}

function trackQuestion(question: string, answer: string, escalated: boolean) {
  try {
    const analytics = JSON.parse(localStorage.getItem('masarak_support_analytics') ?? '{}');
    analytics.total = (analytics.total ?? 0) + 1;
    if (escalated) analytics.escalations = (analytics.escalations ?? 0) + 1;
    
    // Track top questions (simple map)
    const questions: Record<string, number> = analytics.questions ?? {};
    const key = question.slice(0, 50);
    questions[key] = (questions[key] ?? 0) + 1;
    analytics.questions = questions;

    localStorage.setItem('masarak_support_analytics', JSON.stringify(analytics));
  } catch { /* ignore */ }
}
