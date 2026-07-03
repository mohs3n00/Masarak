'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { buttonVariants } from '@/shared/components/atoms/Button';
import { cn } from '@/lib/utils';

interface AppPaginationProps {
  totalPages: number;
}

export function AppPagination({ totalPages }: AppPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center pt-8">
      <div className="flex items-center gap-2">
        <Link 
          href={createPageURL(Math.max(1, currentPage - 1))} 
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "w-10 h-10 rounded-lg text-muted-foreground",
            currentPage <= 1 && "pointer-events-none opacity-50"
          )} 
          scroll={false}
        >
          <ChevronRight className="h-5 w-5 rtl:rotate-180" />
        </Link>
        
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isCurrent = page === currentPage;
          return (
            <Link 
              key={page} 
              href={createPageURL(page)} 
              scroll={false}
              className={cn(
                buttonVariants({ variant: isCurrent ? "primary" : "ghost" }),
                "w-10 h-10 rounded-lg p-0 font-bold", 
                !isCurrent && "text-muted-foreground"
              )}
            >
              {page}
            </Link>
          );
        })}
        
        <Link 
          href={createPageURL(Math.min(totalPages, currentPage + 1))} 
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "w-10 h-10 rounded-lg text-muted-foreground",
            currentPage >= totalPages && "pointer-events-none opacity-50"
          )} 
          scroll={false}
        >
          <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
