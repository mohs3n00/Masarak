import React from 'react';
import { Users, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeacherMetaProps {
  studentsCount: number;
  coursesCount: number;
  className?: string;
}

export function TeacherMeta({ studentsCount, coursesCount, className }: TeacherMetaProps) {
  return (
    <div className={cn("flex items-center gap-4 text-sm text-muted-foreground", className)}>
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4" />
        <span>{studentsCount} طالب</span>
      </div>
      <div className="flex items-center gap-1.5">
        <PlayCircle className="w-4 h-4" />
        <span>{coursesCount} كورس</span>
      </div>
    </div>
  );
}
