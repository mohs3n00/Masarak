'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function CourseSortSelect({ count }: { count: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'relevant';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-between pb-4 border-b border-border/50">
      <p className="text-sm font-medium text-muted-foreground">
        عرض <span className="text-foreground font-bold">{count}</span> دورة تدريبية
      </p>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">ترتيب حسب:</span>
        <select 
          value={currentSort} 
          onChange={handleChange}
          className="bg-transparent font-bold text-foreground focus:outline-none cursor-pointer"
        >
          <option value="relevant">الأكثر صلة</option>
          <option value="newest">الأحدث</option>
          <option value="rating">الأعلى تقييماً</option>
        </select>
      </div>
    </div>
  );
}
