'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, CheckCircle2, Clock, Star, Users, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CourseCardProps {
  id: string;
  title: string;
  teacher: string;
  teacherAvatar?: string;
  thumbnail: string;
  category?: string;
  progress?: number;
  totalLessons: number;
  completedLessons?: number;
  duration?: string;
  rating?: number;
  studentsCount?: number;
  price?: number;
  isEnrolled?: boolean;
  status?: 'active' | 'completed' | 'not-started';
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function CourseCard({
  id,
  title,
  teacher,
  teacherAvatar = 'https://i.pravatar.cc/150?u=teacher',
  thumbnail,
  category = 'تطوير',
  progress = 0,
  totalLessons,
  completedLessons = 0,
  duration = '4س 30د',
  rating = 4.8,
  studentsCount = 1240,
  price,
  isEnrolled = true,
  status = 'active',
  viewMode = 'grid',
  className
}: CourseCardProps) {
  const isList = viewMode === 'list';

  return (
    <Link 
      href={`/dashboard/student/course/${id}`}
      className={cn(
        "group flex bg-card border border-border/60 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative",
        isList ? "flex-col sm:flex-row h-auto sm:h-56" : "flex-col h-full",
        className
      )}
    >
      {/* Thumbnail Section */}
      <div className={cn(
        "relative overflow-hidden bg-muted",
        isList ? "w-full sm:w-72 h-48 sm:h-full shrink-0" : "w-full aspect-[16/10]"
      )}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-4 start-4 end-4 flex justify-between items-start">
          <span className="bg-background/90 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {category}
          </span>
          {isEnrolled && status === 'completed' && (
            <span className="bg-success/90 text-success-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
            </span>
          )}
          {isEnrolled && status === 'active' && (
            <span className="bg-info/90 text-info-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-sm">
              <PlayCircle className="w-3.5 h-3.5" /> قيد التقدم
            </span>
          )}
        </div>

        {/* Play Overlay (On Hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-primary/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary-foreground shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <PlayCircle className="w-7 h-7 ms-1" />
          </div>
        </div>

        {/* Bottom Thumbnail Info */}
        <div className="absolute bottom-4 start-4 end-4 flex justify-between items-end text-white">
          <div className="flex gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-md">
              <Clock className="w-3.5 h-3.5" /> {duration}
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-md">
              <BookOpen className="w-3.5 h-3.5" /> {totalLessons} درس
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-card">
        <div>
          {/* Teacher Info */}
          <div className="flex items-center gap-3 mb-3">
            <Image src={teacherAvatar} alt={teacher} width={28} height={28} className="rounded-full border-2 border-background shadow-sm object-cover shrink-0" />
            <span className="text-muted-foreground text-xs font-medium hover:text-primary transition-colors">{teacher}</span>
          </div>

          <h3 className="font-bold text-base md:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-3">
            {title}
          </h3>

          {/* Metadata (Rating & Students) */}
          {!isEnrolled && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="font-bold text-foreground">{rating}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{studentsCount.toLocaleString()} طالب</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section (Progress or Price) */}
        <div className="mt-4 pt-4 border-t border-border/60">
          {isEnrolled ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-end text-[11px] sm:text-xs">
                <span className="text-muted-foreground font-medium">
                  تم إنجاز {completedLessons} من {totalLessons} درس
                </span>
                <span className="font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-1.5 sm:h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out relative",
                    status === 'completed' ? "bg-success" : "bg-primary"
                  )}
                  style={{ width: `${progress}%` }}
                >
                  {status !== 'completed' && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary">
                {price === 0 ? 'مجاني' : `${price} جنيه`}
              </span>
              <span className="text-xs font-bold text-primary hover:underline">
                عرض التفاصيل
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
