'use client';

import React from 'react';
import { WorkspaceChapter, WorkspaceLesson } from '@/features/learning/types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { CheckCircle2, PlayCircle, Lock, Eye, PlaySquare, FileText, FileQuestion, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseAccordionProps {
  chapters: WorkspaceChapter[];
  activeLessonId?: string;
  onLessonSelect: (lesson: WorkspaceLesson) => void;
  className?: string;
}

export function CourseAccordion({ chapters, activeLessonId, onLessonSelect, className }: CourseAccordionProps) {
  
  const getIcon = (lesson: WorkspaceLesson) => {
    if (lesson.isLocked) return <Lock className="w-5 h-5 text-muted-foreground shrink-0" />;
    if (lesson.completed) return <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />;
    if (lesson.isCurrent) return <PlayCircle className="w-5 h-5 text-primary shrink-0" />;
    if (lesson.isPreview) return <Eye className="w-5 h-5 text-info shrink-0" />;
    
    // Default type icons if not locked, completed, or current
    switch (lesson.type) {
      case 'video': return <PlaySquare className="w-5 h-5 text-blue-500 shrink-0" />;
      case 'pdf': return <FileText className="w-5 h-5 text-error shrink-0" />;
      case 'quiz': return <FileQuestion className="w-5 h-5 text-warning shrink-0" />;
      case 'homework': return <PenTool className="w-5 h-5 text-purple-500 shrink-0" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground shrink-0" />;
    }
  };

  const [openItems, setOpenItems] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    // Only set initial state once to avoid overriding user interactions
    if (openItems.length === 0 && chapters.length > 0) {
      const defaultOpen = chapters
        .filter(c => c.lessons.some(l => l.id === activeLessonId))
        .map(c => c.id);
      setOpenItems(defaultOpen.length > 0 ? defaultOpen : [chapters[0]?.id]);
    }
  }, [chapters, activeLessonId, openItems.length]);

  return (
    <div className={cn("bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full", className)}>
      <div className="p-4 bg-muted/30 border-b border-border">
        <h2 className="font-bold text-lg text-foreground font-heading">محتوى الكورس</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Accordion 
          value={openItems} 
          onValueChange={(v: string[]) => setOpenItems(v)} 
          className="w-full"
        >
          {chapters.map((chapter) => {
            const completedLessons = chapter.lessons.filter(l => l.completed).length;
            const totalLessons = chapter.lessons.length;
            
            return (
              <AccordionItem value={chapter.id} key={chapter.id} className="border-b border-border/50 last:border-none">
                <AccordionTrigger className="px-4 py-4 hover:bg-muted/30 transition-colors data-[state=open]:bg-muted/10">
                  <div className="flex flex-col items-start text-right w-full gap-1">
                    <span className="font-bold text-[15px] text-foreground">{chapter.title}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal mt-1">
                      <span>{completedLessons} / {totalLessons} مكتمل</span>
                      {totalLessons > 0 && (
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="flex flex-col">
                    {chapter.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => !lesson.isLocked && onLessonSelect(lesson)}
                          disabled={lesson.isLocked}
                          className={cn(
                            "w-full text-right flex items-center justify-between p-3 px-4 transition-all border-l-4 border-transparent",
                            isActive ? "bg-primary/5 border-primary" : "hover:bg-muted/50",
                            lesson.isLocked && "opacity-60 cursor-not-allowed hover:bg-transparent"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {getIcon(lesson)}
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-sm font-medium",
                                isActive ? "text-primary font-bold" : "text-foreground",
                                lesson.completed && !isActive && "text-muted-foreground",
                              )}>
                                {lesson.title}
                              </span>
                              {lesson.isPreview && !lesson.completed && !isActive && (
                                <span className="text-[10px] text-info font-bold mt-0.5">معاينة مجانية</span>
                              )}
                            </div>
                          </div>
                          
                          {lesson.duration && (
                            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                              {lesson.duration}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
