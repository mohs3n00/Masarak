import React from 'react';
import { Clock, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseMetaProps {
  durationHours: number;
  lessonsCount: number;
  levelName?: string;
  className?: string;
}

export function CourseMeta({ durationHours, lessonsCount, levelName, className }: CourseMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-sm text-muted-foreground", className)}>
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4" />
        <span>{durationHours} ساعة</span>
      </div>
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-4 h-4" />
        <span>{lessonsCount} درس</span>
      </div>
      {levelName && (
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4" />
          <span>{levelName}</span>
        </div>
      )}
    </div>
  );
}
