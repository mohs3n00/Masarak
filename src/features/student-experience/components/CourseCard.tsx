'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, CheckCircle2, Clock, Star, Users, BookOpen, Heart, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

/**
 * CourseCard — Masarak Design System
 *
 * Two modes:
 *  - Catalog card (not enrolled): shows thumbnail, teacher, rating, price
 *  - Enrolled card: shows progress bar, lesson count
 *
 * No backdrop-blur, no glass effects.
 * Clean, readable, educational design.
 */

export interface CourseCardProps {
  id: string;
  title: string;
  teacher: string;
  teacherAvatar?: string;
  thumbnail: string;
  subject?: string;
  grade?: string;
  progress?: number;
  totalLessons: number;
  completedLessons?: number;
  duration?: string;
  rating?: number;
  studentsCount?: number;
  price?: number;
  originalPrice?: number;
  isFree?: boolean;
  isEnrolled?: boolean;
  status?: 'active' | 'completed' | 'not-started';
  viewMode?: 'grid' | 'list';
  href?: string;
  isFavorite?: boolean;
  onFavoriteClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function CourseCard({
  id,
  title,
  teacher,
  teacherAvatar,
  thumbnail,
  subject,
  grade,
  progress = 0,
  totalLessons,
  completedLessons = 0,
  duration,
  rating,
  studentsCount,
  price,
  originalPrice,
  isFree = false,
  isEnrolled = false,
  status = 'not-started',
  viewMode = 'grid',
  href,
  isFavorite = false,
  onFavoriteClick,
  className,
}: CourseCardProps) {
  const targetHref = href ?? (isEnrolled ? `/dashboard/student/course/${id}` : `/course/${id}`);
  const isList = viewMode === 'list';
  const discount = originalPrice && price && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <Link
      href={targetHref}
      className={cn(
        "group flex bg-white rounded-[1.5rem] overflow-hidden relative",
        "smooth shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isList ? "flex-row" : "flex-col",
        className
      )}
    >
      {/* ── Thumbnail ──────────────────────────────────────── */}
      <div className={cn(
        "relative overflow-hidden bg-muted shrink-0 m-2 rounded-2xl",
        isList ? "w-48 h-full" : "w-[calc(100%-1rem)] aspect-[16/10]"
      )}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail || undefined}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Status badge — top start */}
        <div className="absolute top-3 start-3 flex gap-1.5">
          {isEnrolled && status === 'completed' && (
            <Badge variant="success" size="sm" className="gap-1 shadow-md">
              <CheckCircle2 className="!size-3" /> مكتمل
            </Badge>
          )}
          {isEnrolled && status === 'active' && (
            <Badge variant="info" size="sm" className="gap-1 shadow-md">
              <PlayCircle className="!size-3" /> جاري
            </Badge>
          )}
          {isFree && !isEnrolled && (
            <Badge variant="success" size="sm" className="shadow-md">مجاني</Badge>
          )}
          {discount && !isFree && (
            <Badge variant="error" size="sm" className="font-bold shadow-md">{discount}% خصم</Badge>
          )}
        </div>

        {/* Favorite Button */}
        {onFavoriteClick && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteClick(e);
            }}
            className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-md z-10"
          >
            <Heart className={cn("size-4", isFavorite && "fill-red-500 text-red-500")} />
          </button>
        )}

        {/* Subject & Grade Float Bottom */}
        {(subject || grade) && (
          <div className="absolute bottom-3 end-3 flex gap-2">
            {subject && <Badge variant="primary" size="sm" className="bg-primary/95 text-white shadow-md border-none">{subject}</Badge>}
          </div>
        )}

        {/* Play hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
            <PlayCircle className="size-8 ms-1" />
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 pt-3 gap-4 min-w-0">

        <div className="flex items-center gap-2">
          {grade && <span className="text-primary font-bold text-xs bg-primary/10 px-2 py-1 rounded-md">{grade}</span>}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg leading-snug line-clamp-2 text-slate-900 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-4 text-slate-400" />{totalLessons} درس
          </span>
          {rating && (
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{rating}</span>
            </span>
          )}
          {studentsCount && (
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-slate-400" />{studentsCount.toLocaleString('ar-EG')}
            </span>
          )}
        </div>

        {/* Bottom: Progress (enrolled) or Price (catalog) */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          
          {/* Teacher */}
          <div className="flex items-center gap-2">
            {teacherAvatar ? (
              <Image
                src={teacherAvatar}
                alt={teacher}
                width={28}
                height={28}
                className="rounded-full border border-slate-100 object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{teacher[0]}</span>
              </div>
            )}
            <span className="text-sm font-bold text-slate-700 truncate max-w-[100px]">{teacher}</span>
          </div>

          {isEnrolled ? (
            <div className="w-[120px]">
              <Progress
                value={progress}
                size="sm"
                variant={status === 'completed' ? 'success' : 'default'}
                showLabel
                label={`${completedLessons} من ${totalLessons}`}
              />
            </div>
          ) : (
            <div className="flex flex-col items-end">
              {isFree ? (
                <span className="text-lg font-black text-green-500">مجاني</span>
              ) : price != null ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-primary">{price}</span>
                    <span className="text-xs font-bold text-slate-500">ج.م</span>
                  </div>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-slate-400 line-through font-medium">{originalPrice} ج.م</span>
                  )}
                </>
              ) : (
                <span className="text-sm text-slate-400">—</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
