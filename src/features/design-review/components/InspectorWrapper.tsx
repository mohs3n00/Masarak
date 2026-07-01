'use client';

import { ReactNode, useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InspectorWrapperProps {
  children: ReactNode;
  name: string;
  variant?: string;
  props?: Record<string, unknown>;
  notes?: string;
}

export function InspectorWrapper({ children, name, variant = 'Default', props = {}, notes }: InspectorWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("transition-all duration-200", isHovered && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-md")}>
        {children}
      </div>

      {isHovered && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 bg-black text-white p-3 rounded-lg shadow-xl w-64 text-xs flex flex-col gap-2 border border-white/10 pointer-events-none animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-1.5 font-bold text-sm border-b border-white/10 pb-1.5">
            <Info className="h-3.5 w-3.5 text-primary" />
            {name}
          </div>
          
          <div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 mt-1">
            <span className="text-white/50">Variant</span>
            <span className="text-primary font-mono">{variant}</span>
            
            {Object.entries(props).map(([key, value]) => (
              <Fragment key={key}>
                <span className="text-white/50">{key}</span>
                <span className="font-mono truncate">{String(value)}</span>
              </Fragment>
            ))}
          </div>

          {notes && (
            <div className="mt-1 pt-2 border-t border-white/10 text-white/70 italic">
              {notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Minimal Fragment polyfill to avoid import errors since we're writing raw files
function Fragment({ children }: { children: ReactNode }) { return <>{children}</>; }
