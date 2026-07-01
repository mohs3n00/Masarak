import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/atoms/Avatar';
import { Star, Users, BookOpen } from 'lucide-react';
import type { Teacher } from '@/types/models';
import Link from 'next/link';

interface TeacherPreviewCardProps {
  teacher: Teacher;
  className?: string;
}

export function TeacherPreviewCard({ teacher, className }: TeacherPreviewCardProps) {
  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <Link href={`/teachers/${teacher.id}`} className="block h-full group">
        <div className={cn(
          "h-full flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-card",
          "transition-all duration-200 hover:border-border hover:shadow-sm",
          className
        )}>
          {/* Avatar */}
          <Avatar className="w-20 h-20 mb-4 ring-4 ring-background border border-border/60 group-hover:ring-primary/20 transition-all duration-200">
            <AvatarImage src={teacher.avatar} alt={teacher.name} className="object-cover" />
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              {teacher.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors leading-tight">
            {teacher.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4 line-clamp-1">{teacher.specialization}</p>

          {/* Stats */}
          <div className="w-full flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/40">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-foreground">{teacher.rating.toFixed(1)}</span>
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>{teacher.studentsCount.toLocaleString('ar-SA')}</span>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedDiv>
  );
}
