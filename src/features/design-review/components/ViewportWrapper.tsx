'use client';

import { ReactNode } from 'react';
import { useDesignReviewStore, viewportWidths } from '../store';
import { cn } from '@/lib/utils';

export function ViewportWrapper({ children }: { children: ReactNode }) {
  const { viewport, animations } = useDesignReviewStore();
  const width = viewportWidths[viewport];

  return (
    <div 
      className={cn(
        "bg-background text-foreground shadow-2xl relative overflow-hidden pointer-events-auto",
        viewport !== 'responsive' && "rounded-2xl transition-all duration-300 ease-in-out ring-1 ring-border/50 max-h-[90vh]",
        viewport === 'responsive' && "h-full w-full",
        !animations && "[&_*]:!transition-none [&_*]:!animate-none"
      )}
      style={{ 
        width: viewport === 'responsive' ? '100%' : width, 
        height: viewport === 'responsive' ? '100%' : '100%',
        maxHeight: viewport === 'responsive' ? '100%' : '95vh',
      }}
    >
      <div className="h-full w-full overflow-y-auto overflow-x-hidden relative">
        {children}
      </div>
    </div>
  );
}
