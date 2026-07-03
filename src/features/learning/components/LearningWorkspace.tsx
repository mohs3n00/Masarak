'use client';

import React, { useState } from 'react';
import { useApi } from '@/lib/providers/ApiProvider';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { workspaceMockChapters, workspaceMockResources, WorkspaceLesson } from '@/lib/mock-data/workspace';
import { CourseAccordion } from '@/features/learning/components/CourseAccordion';
import { LessonTabs } from '@/features/learning/components/LessonTabs';
import { MasarakPlayer } from '@/features/media/components/VideoPlayer/MasarakPlayer';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LearningWorkspace() {
  const router = useRouter();
  const { dataState } = useApi();
  const [activeLesson, setActiveLesson] = useState<WorkspaceLesson>(
    workspaceMockChapters[1].lessons[1] // Defaulting to the current lesson 'less_1_2'
  );

  // Get resources for the active lesson (fallback to empty if none mock found)
  const resources = workspaceMockResources[activeLesson.id] || [];
  
  // Find the video resource if one exists
  const videoResource = resources.find(r => r.type === 'VIDEO');

  // Find course title
  const courseTitle = "كورس الليالي الأخيرة: مرحلة الإنجاز"; // Hardcoded for this view

  if (dataState === 'empty') return <DataStateWrapper emptyMessage="Course not found" />;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-background">
      {/* Top Navigation Bar inside Workspace */}
      <div className="w-full bg-card border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 z-40">
         <div className="flex items-center gap-4">
           <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <ArrowRight className="w-5 h-5 text-foreground" />
           </button>
           <div className="flex flex-col">
             <h1 className="text-lg font-bold font-heading">{courseTitle}</h1>
             <span className="text-sm text-muted-foreground">{activeLesson.title}</span>
           </div>
         </div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Area (Player + Tabs) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Video Player Area */}
          <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-lg relative border border-border">
            {videoResource ? (
              <MasarakPlayer 
                src={videoResource.url} 
                poster={videoResource.thumbnailUrl}
                lessonId={String(activeLesson.id)}
                onProgress={(progress) => {
                  // E.g. mark lesson completed if > 90%
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-card">
                 <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                   <span className="text-2xl">👀</span>
                 </div>
                 <h2 className="text-xl font-bold mb-2">لا يوجد فيديو لهذه المحاضرة</h2>
                 <p>يرجى تصفح المرفقات أو الاختبار أسفل هذه الشاشة.</p>
              </div>
            )}
          </div>

          {/* Lesson Title and Info */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold font-heading text-foreground">{activeLesson.title}</h2>
              {activeLesson.duration && (
                <span className="text-sm text-muted-foreground font-mono">المدة: {activeLesson.duration}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {activeLesson.completed && (
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <span>مكتمل</span>
                  <span>✔</span>
                </span>
              )}
            </div>
          </div>

          {/* Lesson Tabs */}
          <LessonTabs 
             resources={resources} 
             onSelectResource={(res) => {
               if (res.type === 'LINK') window.open(res.url, '_blank');
             }} 
          />
          
        </div>

        {/* Sidebar Accordion Area */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
           <CourseAccordion 
             chapters={workspaceMockChapters} 
             activeLessonId={String(activeLesson.id)}
             onLessonSelect={setActiveLesson}
             className="sticky top-[90px] max-h-[calc(100vh-120px)]"
           />
        </div>

      </div>
    </div>
  );
}
