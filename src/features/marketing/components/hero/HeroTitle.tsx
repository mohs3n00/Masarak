import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface HeroTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroTitle({ children, className }: HeroTitleProps) {
  return (
    <AnimatedDiv variant="fadeUp" className={cn("text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6", className)}>
      {children}
    </AnimatedDiv>
  );
}
