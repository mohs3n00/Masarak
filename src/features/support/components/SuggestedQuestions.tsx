'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-3 py-2" dir="rtl">
      <div className="flex items-center gap-1.5 mb-2">
        <Zap className="w-3 h-3 text-primary" />
        <span className="text-[11px] text-muted-foreground font-medium">أسئلة شائعة</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="px-2.5 py-1.5 text-xs rounded-full bg-primary/8 border border-primary/20 text-primary hover:bg-primary/15 transition-colors font-medium"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
