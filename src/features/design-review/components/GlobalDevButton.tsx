'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Palette } from 'lucide-react';

export function GlobalDevButton() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Only render in development, never in production.
  if (process.env.NODE_ENV === 'production' || !isClient) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <Link
        href="/design-review"
        className="pointer-events-auto bg-primary text-primary-foreground p-3 rounded-full shadow-2xl flex items-center gap-2 hover:bg-primary-hover transition-all group hover:pr-4"
      >
        <Palette className="h-5 w-5" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 group-hover:max-w-[150px] font-bold text-sm">
          Design Review
        </span>
      </Link>
    </div>
  );
}
