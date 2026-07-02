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
        "group flex bg-card border border-border rounded-2xl overflow-hidden relative",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isList ? "flex-row" : "flex-col",
        className
      )}
    >
      {/* ── Thumbnail ──────────────────────────────────────── */}
      <div className={cn(
        "relative overflow-hidden bg-muted shrink-0",
        isList ? "w-48 h-full" : "w-full aspect-[16/10]"
      )}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Status badge — top start */}
        <div className="absolute top-2 start-2 flex gap-1.5">
          {isEnrolled && status === 'completed' && (
            <Badge variant="success" size="sm" className="gap-1">
              <CheckCircle2 className="!size-3" /> مكتمل
            </Badge>
          )}
          {isEnrolled && status === 'active' && (
            <Badge variant="info" size="sm" className="gap-1">
              <PlayCircle className="!size-3" /> جاري
            </Badge>
          )}
          {isFree && !isEnrolled && (
            <Badge variant="success" size="sm">مجاني</Badge>
          )}
          {discount && !isFree && (
            <Badge variant="error" size="sm" className="font-bold">{discount}% خصم</Badge>
          )}
        </div>

        {/* Favorite Button */}
        {onFavoriteClick && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteClick(e);
            }}
            className="absolute top-2 end-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-error hover:bg-background transition-colors z-10"
          >
            <Heart className={cn("size-4", isFavorite && "fill-error text-error")} />
          </button>
        )}

        {/* Subject & Grade Float Bottom */}
        {(subject || grade) && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
            {grade && <span className="text-white/90 text-xs font-medium">{grade}</span>}
            {subject && <Badge variant="primary" size="sm" className="bg-primary/90 hover:bg-primary">{subject}</Badge>}
          </div>
        )}

        {/* Play hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground/20">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-md">
            <PlayCircle className="size-6 ms-0.5" />
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-4 min-w-0">

        {/* Title */}
        <h3 className="font-bold text-base leading-snug clamp-2 text-foreground group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Teacher */}
        <div className="flex items-center gap-2">
          {teacherAvatar ? (
            <Image
              src={teacherAvatar}
              alt={teacher}
              width={22}
              height={22}
              className="rounded-full border border-border object-cover shrink-0"
            />
          ) : (
            <div className="w-[22px] h-[22px] rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-primary">{teacher[0]}</span>
            </div>
          )}
          <span className="text-sm font-medium text-muted-foreground truncate">{teacher}</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          {duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />{duration}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-4" />{totalLessons} درس
          </span>
          {rating && (
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-warning text-warning" />
              <span className="font-bold text-foreground">{rating}</span>
            </span>
          )}
          {studentsCount && (
            <span className="flex items-center gap-1.5">
              <Users className="size-4" />{studentsCount.toLocaleString('ar-EG')}
            </span>
          )}
        </div>

        {/* Bottom: Progress (enrolled) or Price (catalog) */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          {isEnrolled ? (
            <div className="w-full">
              <Progress
                value={progress}
                size="sm"
                variant={status === 'completed' ? 'success' : 'default'}
                showLabel
                label={`${completedLessons} من ${totalLessons} درس`}
              />
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                {isFree ? (
                  <span className="text-lg font-black text-success">مجاني</span>
                ) : price != null ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-foreground">{price} ج.م</span>
                    </div>
                    {originalPrice && originalPrice > price && (
                      <span className="text-sm text-muted-foreground line-through font-medium">{originalPrice} ج.م</span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
              <Button variant="outline" size="sm" className="rounded-full bg-muted/50 border-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary group/btn">
                <span className="ms-1">التفاصيل</span>
                <ArrowLeft className="size-4 rtl:rotate-180 transition-transform group-hover/btn:-translate-x-1 rtl:group-hover/btn:translate-x-1" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
