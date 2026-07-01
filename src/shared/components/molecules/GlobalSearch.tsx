'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div 
      className={cn(
        "relative flex items-center transition-all duration-300 ease-in-out",
        "w-full max-w-[280px] lg:max-w-[340px]",
        className
      )}
    >
      <div 
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300 ease-in-out",
          isFocused ? "bg-primary/5 ring-2 ring-primary/20" : "bg-muted/50 hover:bg-muted"
        )} 
      />
      
      <Search 
        className={cn(
          "absolute start-4 h-4 w-4 transition-colors duration-300",
          isFocused ? "text-primary" : "text-muted-foreground"
        )} 
      />
      
      <input
        type="text"
        placeholder="ابحث عن الكورسات، المعلمين..."
        className={cn(
          "w-full h-11 bg-transparent border-none outline-none ps-11 pe-16 text-sm",
          "placeholder:text-muted-foreground/70 text-foreground",
          "rounded-full transition-all duration-300"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <div className="absolute end-2 flex items-center gap-1">
        <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-background/50 px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
