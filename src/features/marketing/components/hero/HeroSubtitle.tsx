import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface HeroSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroSubtitle({ children, className }: HeroSubtitleProps) {
  return (
    <AnimatedDiv variant="fadeUp" className={cn("text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed", className)}>
      {children}
    </AnimatedDiv>
  );
}
