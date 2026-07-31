
'use client';

import React, { useState } from 'react';
import { AskTeacherDialog } from './AskTeacherDialog';
import { MessageCircle } from 'lucide-react';

interface AskTeacherButtonProps {
  courseId: string;
  lessonId?: string;
  videoId?: string;
  teacherId: string;
  contextType: 'VIDEO' | 'PDF' | 'LESSON' | 'QUIZ' | 'ASSIGNMENT' | 'GENERAL';
  getCurrentTimestamp?: () => number; // e.g. for Video
  getCurrentPage?: () => number; // e.g. for PDF
}

export function AskTeacherButton(props: AskTeacherButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-all font-medium"
      >
        <MessageCircle size={20} />
        اسأل المدرس
      </button>

      {isOpen && (
        <AskTeacherDialog 
          {...props} 
          videoTimestamp={props.getCurrentTimestamp?.()}
          pdfPage={props.getCurrentPage?.()}
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
