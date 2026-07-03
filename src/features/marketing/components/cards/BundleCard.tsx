import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Clock, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';
import type { Course, Teacher } from '@/types/models';

interface BundleCardProps {
  course: Course;
  teacher?: Teacher;
  className?: string;
  isBundle?: boolean;
}

export function BundleCard({ course, teacher, className, isBundle = false }: BundleCardProps) {
  const discount = course.originalPrice
    ? Math.round((1 - (parseFloat(course.price.toString()) / parseFloat(course.originalPrice.toString()))) * 100)
    : 0;

  return (
    <AnimatedDiv variant="fadeUp" className="h-full w-full">
      <div className={cn(
        "h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden group",
        "transition-all duration-300 hover:shadow-xl hover:border-primary/50 relative",
        className
      )}>
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/20">
          <Link href={`/course/${course.slug}`} className="block w-full h-full relative">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark gradient overlay at bottom for text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 inset-x-3 flex justify-between items-start pointer-events-none">
            <div className="flex flex-col gap-1.5">
              {isBundle ? (
                <span className="bg-[#DC2626] text-white text-[10px] font-bold px-3 py-1.5 rounded-sm shadow-sm transform -rotate-2">
                  محتوى شهري
                </span>
              ) : (
                <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-sm shadow-sm">
                  كورس منفصل
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm backdrop-blur-md border border-white/10">
                خصم {discount}%
              </span>
            )}
          </div>
          
          {/* Teacher Tag overlay */}
          {teacher && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-800 shadow-sm">
              {teacher.name}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5">
          
          {/* Title */}
          <div className="mb-4">
            <Link href={`/course/${course.slug}`}>
              <h3 className="font-bold text-[16px] leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors text-center">
                {course.title}
              </h3>
            </Link>
            {isBundle && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                يشمل جميع أجزاء الشهر
              </p>
            )}
          </div>

          {/* Details / Lessons List (Mocked for bundle) */}
          <div className="flex flex-col gap-2 text-xs text-muted-foreground font-medium mb-5 bg-muted/30 p-3 rounded-lg flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5"/> الأجزاء:</span>
              <span className="text-foreground">4 أجزاء</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>الجزء الأول</span>
              <span className="text-[10px] bg-muted px-1.5 rounded text-foreground">متوفر</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>الجزء الثاني</span>
              <span className="text-[10px] bg-muted px-1.5 rounded text-foreground">متوفر</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>الجزء الثالث</span>
              <span className="text-[10px] bg-muted px-1.5 rounded text-foreground">متوفر</span>
            </div>
            <div className="flex items-center justify-between py-1 text-muted-foreground/50">
              <span>الجزء الرابع</span>
              <span className="text-[10px] bg-muted px-1.5 rounded">قريباً</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="mt-auto flex flex-col gap-3">
             <div className="flex items-center justify-between text-xs text-muted-foreground">
               <div className="flex items-center gap-1.5">
                 <Clock className="w-3.5 h-3.5" />
                 <span>المدة: 15 ساعة</span>
               </div>
               <div className="flex items-baseline gap-1.5">
                 {course.originalPrice && (
                   <span className="text-xs text-muted-foreground line-through">
                     {course.originalPrice} {course.currency}
                   </span>
                 )}
                 <span className="font-bold text-lg text-foreground text-[#DC2626]">{course.price}</span>
                 <span className="text-[10px] font-bold text-muted-foreground">{course.currency}</span>
               </div>
             </div>
             
             <Button variant="primary" className="w-full font-bold bg-[#DC2626] hover:bg-[#B91C1C] text-white border-[#DC2626]">
               اشترك الآن
             </Button>
          </div>
          
        </div>
      </div>
    </AnimatedDiv>
  );
}
