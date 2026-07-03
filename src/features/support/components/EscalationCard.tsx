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
      className="mx-1 rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🙋</span>
          <p className="text-xs font-bold text-foreground">محتاج مساعدة بشرية؟</p>
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
            'flex items-center gap-2 p-2 rounded-xl text-xs font-medium',
            'bg-primary/10 text-primary hover:bg-primary/20 transition-colors'
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
            'flex items-center gap-2 p-2 rounded-xl text-xs font-medium',
            'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors'
          )}
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>واتساب دعم مسارك</span>
        </a>

        <a
          href="/support/live-chat"
          className={cn(
            'flex items-center gap-2 p-2 rounded-xl text-xs font-medium',
            'bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition-colors'
          )}
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>شات مباشر مع الدعم</span>
        </a>
      </div>
    </div>
  );
}
