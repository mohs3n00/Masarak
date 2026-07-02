import React from 'react';
import { cn } from '@/lib/utils';

/**
 * HeroBackground — Clean, no AI/SaaS effects.
 * Uses a simple solid surface-level tint.
 * No radial gradients, no blurs, no glows.
 */
export function HeroBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
      {/* Subtle top border line for definition */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />
    </div>
  );
}
