'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Category, Level, Course } from '@/types/models';

interface CourseSidebarFiltersProps {
  categories: any[];
  totalCourses?: number;
  levels: Level[];
}

export function CourseSidebarFilters({ categories, totalCourses = 0, levels }: CourseSidebarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('subject') || searchParams.get('category');
  const currentLevels = searchParams.getAll('level');

  const createURL = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
      if (key === 'subject') params.delete('category');
    } else {
      params.set(key, value);
      if (key === 'subject') params.delete('category');
    }
    params.delete('page');
    return `${pathname}?${params.toString()}`;
  };

  const handleLevelToggle = (level: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const levels = params.getAll('level');
    
    // Clear existing to reconstruct
    params.delete('level');
    
    if (levels.includes(level)) {
      levels.filter(l => l !== level).forEach(l => params.append('level', l));
    } else {
      levels.forEach(l => params.append('level', l));
      params.append('level', level);
    }
    
    params.delete('page');
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <aside className="hidden lg:block space-y-8">
      <div>
        <h3 className="font-bold text-lg mb-4 text-foreground">المواد الدراسية</h3>
        <div className="flex flex-col gap-1.5">
          <Link 
            href={createURL('subject', null)} 
            scroll={false}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-sm transition-colors text-start", 
              !currentCategory ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            الكل
            <span className={cn("px-2 py-0.5 rounded-md text-xs", !currentCategory ? "bg-primary/20" : "bg-background/60 text-foreground")}>
              {totalCourses}
            </span>
          </Link>
          
          {categories
            .map((cat, idx) => {
            const isActive = currentCategory === cat.slug;
            return (
              <Link 
                key={cat.id} 
                href={createURL('subject', cat.slug)}
                scroll={false}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-colors text-start group", 
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat.name}
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-xs transition-colors", 
                  isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-background"
                )}>
                  {cat.coursesCount || cat.courseCount || 0}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
