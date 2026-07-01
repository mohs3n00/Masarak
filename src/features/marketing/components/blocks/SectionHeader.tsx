import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({ title, subtitle, badge, align = 'center', className }: SectionHeaderProps) {
  return (
    <AnimatedDiv
      variant="fadeUp"
      className={cn(
        "flex flex-col gap-4 mb-12",
        align === 'center' ? 'items-center text-center mx-auto' : '',
        align === 'left' ? 'items-start text-start' : '',
        align === 'right' ? 'items-end text-end' : '',
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center text-[12px] font-semibold text-primary tracking-wide bg-primary/8 px-3.5 py-1 rounded-full border border-primary/15">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </AnimatedDiv>
  );
}
