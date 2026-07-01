import React from 'react';

export function DesignReviewLayout({ 
  children, 
  title, 
  description 
}: { 
  children: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex-1 rounded-xl border border-border/40 bg-muted/10 p-6 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
