import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import * as Icons from 'lucide-react';
import type { Category } from '@/types/models';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  /* @ts-expect-error Typescript complains about IconComponent type but it's valid Lucide icon */
  const Icon = Icons[category.icon || 'Layout'] || Icons.Layout;

  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <Link href={`/courses?category=${category.slug}`} className="block h-full group">
        <div className={cn(
          "h-full flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card",
          "transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-sm",
          className
        )}>
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary shrink-0 transition-all duration-200 group-hover:bg-primary/15">
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </div>
          
          {/* Content */}
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
              {category.name}
            </h3>
            <span className="text-xs text-muted-foreground mt-0.5">
              {(category as any).coursesCount || category.courseCount || 0} كورس
            </span>
          </div>
        </div>
      </Link>
    </AnimatedDiv>
  );
}
