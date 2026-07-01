import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/atoms/Avatar';
import { Star, Clock, Users } from 'lucide-react';
import type { Course, Teacher } from '@/types/models';

interface CoursePreviewCardProps {
  course: Course;
  teacher?: Teacher;
  className?: string;
  isEnrolled?: boolean;
  progress?: number;
}

export function CoursePreviewCard({ course, teacher, className, isEnrolled, progress }: CoursePreviewCardProps) {
  const discount = course.originalPrice
    ? Math.round((1 - (parseFloat(course.price.toString()) / parseFloat(course.originalPrice.toString()))) * 100)
    : 0;

  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <div className={cn(
        "h-full flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden group",
        "transition-all duration-200 hover:shadow-md hover:border-border",
        className
      )}>
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted/20">
          <Link href={`/course/${course.slug}`} className="block w-full h-full">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 inset-x-3 flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="bg-error text-error-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  خصم {discount}%
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {isEnrolled && progress !== undefined && (
            <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20">
              <div
                className="h-full bg-primary transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-4 gap-2.5">
          
          {/* Title */}
          <Link href={`/course/${course.slug}`}>
            <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Teacher */}
          {teacher && (
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5 shrink-0">
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback className="text-[8px]">{teacher.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground font-medium line-clamp-1">{teacher.name}</span>
            </div>
          )}

          {/* Meta: Rating + Students */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              <span className="text-foreground font-semibold">{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 shrink-0" />
              <span>{(course.studentsCount || 0).toLocaleString('ar-SA')} طالب</span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base text-foreground">{course.price}</span>
              <span className="text-xs font-medium text-muted-foreground">{course.currency}</span>
            </div>
            {course.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {course.originalPrice} {course.currency}
              </span>
            )}
          </div>
        </div>
      </div>
    </AnimatedDiv>
  );
}
