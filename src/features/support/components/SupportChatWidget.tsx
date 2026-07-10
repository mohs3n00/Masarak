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
import { UserContext, ChatMessage } from '../types';



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
    if (inputRef.current) inputRef.current.style.height = 'auto';
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
          'fixed bottom-24 left-4 z-50 w-[380px] max-w-[calc(100vw-2rem)]',
          'flex flex-col rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-border/50 bg-background/95 backdrop-blur-xl',
          'transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) origin-bottom-left',
          isOpen && !isMinimized
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none',
        )}
        style={{ height: isOpen && !isMinimized ? '560px' : '0' }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 shrink-0 relative overflow-hidden bg-gradient-to-br from-surface to-background rounded-t-[24px]">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white shadow-lg relative z-10 border border-white/10">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background z-20" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[15px] text-foreground leading-none mb-1">مساعد مسارك</p>
            <p className="text-[12px] text-muted-foreground flex items-center gap-1.5">
              متصل الآن ويجيب فوراً
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { clearHistory(); setShowSuggestions(true); }}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              title="مسح المحادثة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              title="تصغير"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>



        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 custom-scrollbar">
          {/* Welcome */}
          {!hasMessages && (
            <div className="flex gap-3 items-end animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white shrink-0 mb-1 shadow-sm">
                <BotMessageSquare className="w-4 h-4" />
              </div>
              <div
                className="bg-surface border border-border-subtle rounded-2xl rounded-br-sm px-4 py-3 text-[14px] leading-relaxed max-w-[85%] shadow-sm text-foreground"
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
        <div className="px-4 py-3 shrink-0 border-t border-border/50 bg-background/50 rounded-b-[24px]">
          <div className="flex items-end gap-2 bg-surface rounded-2xl border border-border-subtle px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="اسألني أي سؤال عن مسارك..."
              className="flex-1 bg-transparent text-[14px] resize-none outline-none max-h-[100px] min-h-[24px] py-1.5 leading-snug placeholder:text-muted-foreground"
              dir="rtl"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-300 shrink-0 flex items-center justify-center',
                input.trim() && !isLoading
                  ? 'bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2.5 opacity-70">
            <Sparkles className="w-3 h-3 text-primary" />
            <p className="text-[11px] text-muted-foreground font-medium">
              الردود تلقائية مدعومة بالذكاء الاصطناعي
            </p>
          </div>
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
          'fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
          'flex items-center justify-center transition-all duration-300',
          isOpen 
            ? 'bg-surface border border-border text-foreground hover:scale-105 hover:shadow-lg' 
            : 'bg-primary text-primary-foreground hover:scale-110 hover:shadow-primary/30 hover:shadow-xl',
          'active:scale-95'
        )}
        aria-label="مساعد الدعم"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm border-2 border-background animate-in zoom-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>


    </>
  );
}
