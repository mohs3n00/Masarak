'use client';

import { useApi } from '@/lib/providers/ApiProvider';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { CourseCard } from '@/features/student-experience/components/CourseCard';
import { Heart, Search } from 'lucide-react';

export default function WishlistPage() {
  const { dataState } = useApi();
  const wishlist = dataState === 'empty' ? [] : studentMockData.recommendedCourses.slice(0, 2);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-error fill-error/20" /> المفضلة
          </h1>
          <p className="text-muted-foreground text-sm">الدورات التي قمت بحفظها للرجوع إليها لاحقاً.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث في المفضلة..."
            className="w-full bg-card border border-border/60 rounded-xl ps-11 pe-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all placeholder:text-muted-foreground text-foreground"
          />
        </div>
      </div>

      <DataStateWrapper emptyType="favorites" emptyMessage="المفضلة فارغة. تصفح دليل الدورات واحفظ الدورات التي تهمك.">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map(course => (
            <CourseCard 
              key={course.id} 
              id={course.id}
              title={course.title}
              teacher={course.teacher}
              thumbnail={course.thumbnail}
              isEnrolled={false}
              price={Number(course.price.replace(/[^0-9.-]+/g,""))}
              rating={course.rating}
              studentsCount={course.students}
              totalLessons={20}
              viewMode="grid"
            />
          ))}
        </div>
      </DataStateWrapper>
    </div>
  );
}
