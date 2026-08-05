// src/features/learning/components/AskAiButton.tsx
'use client';

import React, { useState } from 'react';
import { AskAiDialog } from './AskAiDialog';
import { BotMessageSquare } from 'lucide-react';

interface AskAiButtonProps {
  courseTitle: string;
  lessonTitle: string;
}

export function AskAiButton(props: AskAiButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
      >
        <BotMessageSquare size={20} />
        اسأل المساعد الذكي
      </button>

      {isOpen && (
        <AskAiDialog 
          {...props} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
