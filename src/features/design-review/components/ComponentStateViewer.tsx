import React from 'react';

export function ComponentStateViewer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-7xl mx-auto rounded-3xl border border-border bg-card shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-10 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
        </div>
        <div className="pt-10 h-full min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
}
