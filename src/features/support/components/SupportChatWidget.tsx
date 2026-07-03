'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  MessageCircle, X, Send, Minimize2, Trash2, 
  ChevronDown, Sparkles, BotMessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupportChat } from '../hooks/useSupportChat';
import { ChatMessageBubble } from './ChatMessageBubble';
import { SuggestedQuestions } from './SuggestedQuestions';
import { EscalationCard } from './EscalationCard';
import { suggestedQuestions } from '../knowledge/masarakKnowledge';
import { UserContext } from '../types';

const WELCOME_MESSAGE = 'أهلاً! أنا مساعد مسارك الذكي 👋\n\nأقدر أساعدك في أي سؤال عن المنصة زي الاشتراكات، الدفع، مشاكل الفيديوهات، أو أي حاجة تانية. اسألني!';

interface SupportChatWidgetProps {
  userContext?: UserContext;
}

export function SupportChatWidget({ userContext }: SupportChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, showEscalation, sendMessage, giveFeedback, clearHistory } = useSupportChat(userContext);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Track unread when minimized
  useEffect(() => {
    if (!isOpen || isMinimized) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg.status === 'done') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen, isMinimized]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(async (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim() || isLoading) return;
    setInput('');
    setShowSuggestions(false);
    await sendMessage(msg);
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionSelect = (q: string) => {
    handleSubmit(q);
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ── Chat Panel ─────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed bottom-24 left-4 z-50 w-[360px] max-w-[calc(100vw-2rem)]',
          'flex flex-col rounded-2xl shadow-2xl border border-border bg-background',
          'transition-all duration-300 ease-in-out origin-bottom-left',
          isOpen && !isMinimized
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none',
        )}
        style={{ height: isOpen && !isMinimized ? '520px' : '0' }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 rounded-t-2xl shrink-0 shadow-sm relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-inner border border-white/20">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-white leading-none">مساعد مسارك</p>
            <p className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              متاح الآن
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { clearHistory(); setShowSuggestions(true); }}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="مسح المحادثة"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="تصغير"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 custom-scrollbar">
          {/* Welcome */}
          {!hasMessages && (
            <div className="flex gap-2 items-end">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shrink-0 mb-1 shadow-sm ring-1 ring-primary/20">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div
                className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm max-w-[80%] shadow-sm"
                dir="rtl"
              >
                <span className="whitespace-pre-wrap">{WELCOME_MESSAGE}</span>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map(msg => (
            <ChatMessageBubble
              key={msg.id}
              message={msg}
              onFeedback={giveFeedback}
            />
          ))}

          {/* Escalation card */}
          {showEscalation && (
            <EscalationCard />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {showSuggestions && !hasMessages && (
          <SuggestedQuestions
            questions={suggestedQuestions}
            onSelect={handleSuggestionSelect}
          />
        )}

        {/* Divider */}
        <div className="h-px bg-border mx-3 shrink-0" />

        {/* Input Area */}
        <div className="px-3 py-2.5 shrink-0">
          <div className="flex items-end gap-2 bg-muted/50 rounded-xl border border-border px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اسألني أي سؤال عن مسارك..."
              className="flex-1 bg-transparent text-sm resize-none outline-none max-h-20 min-h-[20px] leading-snug placeholder:text-muted-foreground"
              dir="rtl"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className={cn(
                'p-2 rounded-lg transition-all duration-200 shrink-0',
                input.trim() && !isLoading
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                  : 'text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            الردود تلقائية • للدعم المباشر اضغط على 🙋
          </p>
        </div>
      </div>

      {/* ── Minimized Bar ──────────────────────────────────────── */}
      {isOpen && isMinimized && (
        <div
          className="fixed bottom-24 left-4 z-50 w-[280px] rounded-2xl shadow-xl border border-white/20 bg-gradient-to-r from-primary to-primary/90 cursor-pointer overflow-hidden backdrop-blur-md hover:scale-105 transition-transform"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <BotMessageSquare className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white flex-1">مساعد مسارك</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <ChevronDown className="w-4 h-4 text-white/70" />
          </div>
        </div>
      )}

      {/* ── Floating Toggle Button ─────────────────────────────── */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className={cn(
          'fixed bottom-6 left-4 z-50 w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center transition-all duration-300',
          'bg-primary text-primary-foreground hover:scale-110 active:scale-95',
          'ring-4 ring-primary/20'
        )}
        aria-label="مساعد الدعم"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* ── Tooltip on first visit ────────────────────────────── */}
      {!isOpen && !hasMessages && (
        <div
          className="fixed bottom-24 left-4 z-50 bg-foreground text-background text-xs px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-bounce cursor-pointer select-none"
          onClick={handleOpen}
          dir="rtl"
        >
          <Sparkles className="w-3 h-3 text-yellow-400 shrink-0" />
          <span>محتاج مساعدة؟ اسألني!</span>
          <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-foreground rotate-45 rounded-sm" />
        </div>
      )}
    </>
  );
}
