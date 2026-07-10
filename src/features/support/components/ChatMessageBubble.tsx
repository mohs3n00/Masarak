'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown, Copy, Check, BotMessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType } from '../types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback: (id: string, feedback: 'helpful' | 'not_helpful') => void;
}

export function ChatMessageBubble({ message, onFeedback }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';
  const isSending = message.status === 'sending';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('flex gap-3 items-end animate-in fade-in slide-in-from-bottom-2 duration-300', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white shrink-0 mb-1 shadow-sm">
          <BotMessageSquare className="w-4 h-4" />
        </div>
      )}

      <div className={cn('flex flex-col gap-1 max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
        {/* Bubble */}
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-opacity duration-300',
            isUser
              ? 'bg-gradient-to-r from-primary to-primary/90 text-white rounded-br-sm shadow-md'
              : 'bg-surface border border-border-subtle rounded-bl-sm text-foreground',
            isSending && 'opacity-60'
          )}
          dir="rtl"
        >
          {isSending ? (
            <TypingDots />
          ) : (
            <div className={cn('prose prose-sm max-w-none', isUser ? 'prose-invert' : 'dark:prose-invert')}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Time */}
        <span className="text-[10px] text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Actions (only for assistant messages that are done) */}
        {!isUser && !isSending && message.content && (
          <div className="flex items-center gap-1 px-1">
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="نسخ"
            >
              {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
            </button>
            
            {message.feedback === undefined && (
              <>
                <button
                  onClick={() => onFeedback(message.id, 'helpful')}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-green-500 transition-colors"
                  title="مفيد"
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onFeedback(message.id, 'not_helpful')}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                  title="غير مفيد"
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </>
            )}

            {message.feedback === 'helpful' && (
              <span className="text-[10px] text-green-600 font-medium">شكراً! 👍</span>
            )}
            {message.feedback === 'not_helpful' && (
              <span className="text-[10px] text-muted-foreground font-medium">سيتم التحسين 🙏</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2 px-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '800ms' }}
        />
      ))}
    </div>
  );
}
