import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PublicCategory } from '@/lib/api/public';

interface SubjectCardProps {
  category: PublicCategory;
  className?: string;
}

export function SubjectCard({ category, className }: SubjectCardProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-between p-6 rounded-3xl",
        "bg-primary text-white shadow-xl shadow-primary/20",
        "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30",
        className
      )}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 mb-4 flex items-center justify-center">
          {/* Default icon if no category icon */}
          <BookOpen className="w-10 h-10 text-white/90" />
        </div>
        <h3 className="text-xl font-bold text-center">{category.name}</h3>
      </div>
      
      <div className="w-full space-y-3 mb-6">
        <div className="flex justify-between items-center text-white/90 text-sm font-medium border-b border-white/20 pb-2">
          <span>المدرسين</span>
          <span className="font-bold">{(category as any).teachersCount || 0}</span>
        </div>
        <div className="flex justify-between items-center text-white/90 text-sm font-medium">
          <span>الكورسات</span>
          <span className="font-bold">{category.coursesCount || 0}</span>
        </div>
      </div>
      
      <Link 
        href={`/courses?category=${category.slug}`}
        className="w-full"
      >
        <button className="w-full bg-white text-primary hover:bg-gray-50 py-3 rounded-2xl font-bold transition-colors">
          اعرف اكتر
        </button>
      </Link>
    </div>
  );
}
