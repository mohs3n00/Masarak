import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface HeroBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroBadge({ children, className }: HeroBadgeProps) {
  return (
    <AnimatedDiv variant="fadeUp" className={cn("inline-flex items-center rounded-full border bg-background/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-primary mb-6", className)}>
      {children}
    </AnimatedDiv>
  );
}
