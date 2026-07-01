import React from 'react';
import { cn } from '@/lib/utils';

export function HeroBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
      {/* Soft radial gradient from top-center — very subtle green warmth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(0,212,110,0.07)_0%,transparent_70%)]" />
      {/* Secondary soft glow bottom-right for depth */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,212,110,0.04)_0%,transparent_60%)]" />
    </div>
  );
}
