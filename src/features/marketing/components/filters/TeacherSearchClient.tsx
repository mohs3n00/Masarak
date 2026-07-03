'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';

export function TeacherSearchClient() {
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
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mt-4">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن معلم بالاسم أو التخصص..."
          className="w-full bg-background border border-border/60 rounded-xl h-14 ps-11 pe-32 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
        />
        <div className="absolute inset-y-1 end-1">
          <Button type="submit" className="h-full rounded-lg px-6 font-bold">بحث</Button>
        </div>
      </div>
    </form>
  );
}
