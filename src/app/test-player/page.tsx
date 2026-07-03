'use client';

import React from 'react';
import { Lesson, LessonMedia } from '@/types/models';
import { Navbar } from '@/shared/components/organisms/Navbar';
import dynamic from 'next/dynamic';

const LessonViewer = dynamic(() => import('@/features/learning/components/LessonViewer').then(mod => mod.LessonViewer), { ssr: false });
const MediaUploadZone = dynamic(() => import('@/features/admin/components/media/MediaUploadZone').then(mod => mod.MediaUploadZone), { ssr: false });

// Mock Data
const mockLesson: Lesson = {
  id: 'lesson_1',
  chapterId: 'chap_1',
  courseId: 'course_1',
  title: 'الدرس الأول: مقدمة في بناء تطبيقات الويب',
  description: 'في هذا الدرس سنتعرف على أساسيات بناء تطبيقات الويب الحديثة باستخدام تقنيات مثل React و Next.js.',
  order: 1,
  isPreview: true,
  estimatedDurationMinutes: 45,
  isLocked: false,
};

const mockMedia: LessonMedia[] = [
  {
    id: 'media_1',
    lessonId: 'lesson_1',
    title: 'فيديو الشرح التفصيلي',
    type: 'VIDEO',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', // YouTube test video
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop',
    durationSeconds: 600,
    isRequired: true,
    order: 1,
  },
  {
    id: 'media_2',
    lessonId: 'lesson_1',
    title: 'ملخص الدرس (PDF)',
    type: 'PDF',
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', // Public PDF test file
    sizeBytes: 2500000,
    isRequired: false,
    order: 2,
  },
  {
    id: 'media_3',
    lessonId: 'lesson_1',
    title: 'أكواد المشروع (مضغوط)',
    type: 'ZIP',
    url: '#',
    sizeBytes: 15000000,
    isRequired: false,
    order: 3,
  },
  {
    id: 'media_4',
    lessonId: 'lesson_1',
    title: 'رابط المراجع الخارجية',
    type: 'LINK',
    url: 'https://react.dev',
    isRequired: false,
    order: 4,
  }
];

export default function TestPlayerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-12 space-y-16">
        
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">1. تجربة منصة عرض الدروس (طالب)</h2>
            <p className="text-muted-foreground mt-2">يعرض مشغل الفيديو المتطور (HLS)، ومستعرض الـ PDF، وقائمة المرفقات.</p>
          </div>
          
          <LessonViewer 
            lesson={mockLesson} 
            media={mockMedia}
            onProgressUpdate={(id, prog) => console.log(`Progress for ${id}: ${prog}%`)}
            onLessonComplete={(id) => alert(`تم الانتهاء من الدرس: ${id}`)}
          />
        </section>

        <hr className="border-border" />

        <section className="max-w-3xl mx-auto pb-20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground">2. تجربة رفع الملفات (أدمن/مدرس)</h2>
            <p className="text-muted-foreground mt-2">قم بسحب وإفلات أي ملف لتجربة تأثير الرفع الوهمي.</p>
          </div>
          
          <MediaUploadZone 
            onUploadStart={(files) => console.log('Started uploading:', files.length)}
            onUploadSuccess={(urls) => console.log('Uploaded files to URLs:', urls)}
            onUploadError={(err) => alert(err)}
          />
        </section>

      </main>
    </div>
  );
}
