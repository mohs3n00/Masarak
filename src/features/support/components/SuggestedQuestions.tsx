'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-5 py-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150 fill-mode-both" dir="rtl">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="text-[12px] text-muted-foreground font-medium">أسئلة شائعة</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="px-3.5 py-1.5 text-[12px] rounded-full bg-surface border border-border-subtle hover:border-primary/40 hover:bg-primary/5 text-foreground hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
