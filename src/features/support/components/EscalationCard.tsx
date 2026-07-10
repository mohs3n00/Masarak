'use client';

import React from 'react';
import { MessageCircle, X, Ticket, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EscalationCardProps {
  onClose?: () => void;
}

export function EscalationCard({ onClose }: EscalationCardProps) {
  return (
    <div
      className="mx-1 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-950/20 p-4 shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="text-[12px]">🙋</span>
          </div>
          <p className="text-[13px] font-bold text-foreground">تحتاج لمساعدة بشرية؟</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <a
          href="/support/ticket"
          className={cn(
            'flex items-center gap-2.5 p-2.5 rounded-xl text-[13px] font-medium border border-transparent',
            'bg-surface hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all shadow-sm'
          )}
        >
          <Ticket className="w-4 h-4 shrink-0" />
          <span>فتح تذكرة دعم</span>
        </a>

        <a
          href="https://wa.me/201XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2.5 p-2.5 rounded-xl text-[13px] font-medium border border-transparent',
            'bg-surface hover:bg-green-500/5 hover:border-green-500/20 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all shadow-sm'
          )}
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>واتساب دعم مسارك</span>
        </a>

        <a
          href="/support/live-chat"
          className={cn(
            'flex items-center gap-2.5 p-2.5 rounded-xl text-[13px] font-medium border border-transparent',
            'bg-surface hover:bg-blue-500/5 hover:border-blue-500/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all shadow-sm'
          )}
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>شات مباشر مع الدعم</span>
        </a>
      </div>
    </div>
  );
}
