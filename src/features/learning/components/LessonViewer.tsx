'use client';

import React, { useState, useMemo } from 'react';
import { Lesson, LessonMedia } from '@/types/models';
import { MasarakPlayer } from '@/features/media/components/VideoPlayer/MasarakPlayer';
import { MasarakPdfViewer } from '@/features/media/components/PdfViewer/MasarakPdfViewer';
import { ResourcesPanel } from './ResourcesPanel';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LessonViewerProps {
  lesson: Lesson;
  media: LessonMedia[];
  onProgressUpdate?: (lessonId: string, progressPercent: number) => void;
  onLessonComplete?: (lessonId: string) => void;
}

export function LessonViewer({ lesson, media, onProgressUpdate, onLessonComplete }: LessonViewerProps) {
  // Main media is usually the video or the first PDF
  const mainVideo = useMemo(() => media.find(m => m.type === 'VIDEO'), [media]);
  const mainPdf = useMemo(() => media.find(m => m.type === 'PDF'), [media]);
  
  // All other resources (or all if we want to show PDFs in the list too)
  const resources = useMemo(() => media.filter(m => m.type !== 'VIDEO'), [media]);

  const [activeMediaId, setActiveMediaId] = useState<string | number | undefined>(
    mainVideo?.id || mainPdf?.id
  );

  const activeMedia = useMemo(() => media.find(m => m.id === activeMediaId), [media, activeMediaId]);

  const handleVideoProgress = (data: { playedSeconds: number; playedPercentage: number }) => {
    onProgressUpdate?.(lesson.id as string, data.playedPercentage);
    if (data.playedPercentage >= 90) {
      onLessonComplete?.(lesson.id as string);
    }
  };

  const handlePdfProgress = (numPages: number) => {
    // If the PDF loads fully, we could consider it viewed, or track scrolling. 
    // For now, mark as complete if they open it.
    onProgressUpdate?.(lesson.id as string, 100);
    onLessonComplete?.(lesson.id as string);
  };

  if (lesson.isLocked && !lesson.isPreview) {
    return (
      <div className="w-full aspect-video bg-muted rounded-xl flex flex-col items-center justify-center border border-border shadow-inner p-6 text-center">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">هذا الدرس مغلق</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          يجب عليك شراء الكورس أو الاشتراك في الباقة للتمكن من مشاهدة هذا الدرس والمحتوى المرفق به.
        </p>
        <Button>اشترك الآن</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.description}</p>
        {lesson.isPreview && (
          <span className="inline-block mt-2 px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
            معاينة مجانية
          </span>
        )}
      </div>

      <div className="w-full shadow-lg rounded-xl overflow-hidden mb-8">
        {activeMedia?.type === 'VIDEO' ? (
          <MasarakPlayer 
            src={activeMedia.url} 
            poster={activeMedia.thumbnailUrl}
            lessonId={lesson.id as string}
            studentAuth={{
              studentId: 'STD-2024-9182',
              studentName: 'أحمد محمود العراقي',
              studentPhone: '01012345678',
            }}
            onProgress={handleVideoProgress}
            onEnded={() => onLessonComplete?.(lesson.id as string)}
          />
        ) : activeMedia?.type === 'PDF' ? (
          <MasarakPdfViewer 
            url={activeMedia.url} 
            onLoadSuccess={handlePdfProgress}
            className="w-full h-[600px]"
          />
        ) : activeMedia?.type === 'IMAGE' ? (
           <div className="w-full h-[600px] bg-muted flex items-center justify-center p-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={activeMedia.url} alt={activeMedia.title} className="max-w-full max-h-full object-contain rounded-md shadow-sm" />
           </div>
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center text-muted-foreground p-6 text-center">
            يرجى تحديد ملف من قائمة المرفقات والمصادر لعرضه.
          </div>
        )}
      </div>

      <ResourcesPanel 
        resources={resources} 
        onSelectResource={(res) => {
          if (res.type === 'PDF' || res.type === 'VIDEO' || res.type === 'IMAGE') {
            setActiveMediaId(res.id as string);
          } else if (res.type === 'LINK') {
            window.open(res.url, '_blank');
          }
        }}
        activeResourceId={activeMediaId}
      />
    </div>
  );
}
