'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';

export function CourseSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    // Reset page on search
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن دورة، مهارة، أو موضوع..."
          className="w-full bg-background border border-border/60 rounded-xl h-12 ps-11 pe-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
        />
      </div>
      <Button type="submit" variant="outline" className="h-12 px-6 rounded-xl gap-2 font-bold shrink-0">
        <Filter className="h-5 w-5" />
        فلترة النتائج
      </Button>
    </form>
  );
}
