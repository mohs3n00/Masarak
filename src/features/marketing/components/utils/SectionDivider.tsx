import React from 'react';
import { cn } from '@/lib/utils';

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-px bg-border", className)} aria-hidden="true" />
  );
}
