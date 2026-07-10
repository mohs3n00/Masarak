'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/atoms/Avatar';
import { Star, Clock, Users, BookOpen } from 'lucide-react';
import type { Course, Teacher } from '@/types/models';

interface CoursePreviewCardProps {
  course: Course & { thumbnailUrl?: string };
  teacher?: Teacher;
  className?: string;
  isEnrolled?: boolean;
  progress?: number;
}

export function CoursePreviewCard({ course, teacher, className, isEnrolled, progress }: CoursePreviewCardProps) {
  const [imgError, setImgError] = useState(false);
  const discount = course.originalPrice
    ? Math.round((1 - (parseFloat(course.price.toString()) / parseFloat(course.originalPrice.toString()))) * 100)
    : 0;

  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <div className={cn(
        "h-full flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden group",
        "transition-all duration-300 hover:shadow-lg hover:border-border/60",
        className
      )}>
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted/20">
          <Link href={`/course/${course.slug}`} className="block w-full h-full relative">
            {(course.thumbnail || course.thumbnailUrl) && !imgError ? (
              <img
                src={(() => {
                  const url = course.thumbnail || course.thumbnailUrl || '';
                  return url.startsWith('http') || url.startsWith('/') ? url : `https://${url}`;
                })()}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground/30 transition-transform duration-700 group-hover:scale-[1.05]">
                <BookOpen className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-xl font-bold px-4 text-center line-clamp-1">{course.title}</span>
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 inset-x-3 flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="bg-error/90 backdrop-blur-md text-error-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ring-1 ring-white/20">
                  خصم {discount}%
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {isEnrolled && progress !== undefined && (
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/20 backdrop-blur-sm">
              <div
                className="h-full bg-primary transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5 gap-3">
          
          {/* Title */}
          <Link href={`/course/${course.slug}`}>
            <h3 className="font-bold text-[16px] tracking-tight leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Teacher */}
          {teacher && (
            <div className="flex items-center gap-2 mt-0.5">
              <Avatar className="w-6 h-6 shrink-0 ring-1 ring-border/50">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{teacher.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground font-medium line-clamp-1">{teacher.name}</span>
            </div>
          )}

          {/* Meta: Rating + Students */}
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground mt-1">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="text-foreground font-semibold">{(course.rating || 0).toFixed(1)}</span>
            </div>
            <span className="text-border/60">•</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span>{(course.studentsCount || 0).toLocaleString('ar-SA')} طالب</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-lg text-primary">{course.price}</span>
              <span className="text-[13px] font-medium text-muted-foreground">{course.currency}</span>
            </div>
            {course.originalPrice && (
              <span className="text-[13px] font-medium text-muted-foreground/60 line-through">
                {course.originalPrice} {course.currency}
              </span>
            )}
          </div>
        </div>
      </div>
    </AnimatedDiv>
  );
}
