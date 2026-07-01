import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

interface HeroCTAProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroCTA({ children, className }: HeroCTAProps) {
  return (
    <AnimatedDiv variant="fadeUp" className={cn("flex flex-col sm:flex-row items-center gap-4", className)}>
      {children}
    </AnimatedDiv>
  );
}
