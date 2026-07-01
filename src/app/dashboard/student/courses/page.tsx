'use client';

import { useState } from 'react';
import { useApi } from '@/lib/providers/ApiProvider';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { CourseCard } from '@/features/student-experience/components/CourseCard';
import { Search, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyCoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Connect to global API mock provider
  const { dataState } = useApi();
  
  // Use mock data, but apply empty state logic if triggered by Dev Toolbar
  const courses = dataState === 'empty' ? [] : studentMockData.allCourses;
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">كورساتي</h1>
          <p className="text-muted-foreground mt-1 text-sm">إدارة ومتابعة الدورات التي سجلت بها.</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card p-2 rounded-xl border border-border/60 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث في دوراتك..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/40 border border-border/50 rounded-lg ps-10 pe-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-colors placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters & View Toggles */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-border/50 font-medium">
            <SlidersHorizontal className="h-4 w-4" />
            <span>تصفية</span>
          </button>
          
          <div className="h-6 w-px bg-border/60 mx-1" />
          
          <div className="flex bg-muted/60 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground")}
              aria-label="عرض شبكي"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground")}
              aria-label="عرض قائمة"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area wrapped in DataStateWrapper for Dev Review overrides */}
      <DataStateWrapper emptyMessage="لم تقم بالتسجيل في أي دورات بعد. استكشف دليل الدورات لتبدأ التعلم.">
        <div className={cn(
          "grid gap-5",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.id} 
              {...course} 
              viewMode={viewMode} 
              status={course.status as 'active' | 'completed' | 'not-started'}
            />
          ))}
        </div>
        
        {filteredCourses.length === 0 && courses.length > 0 && (
          <div className="text-center p-12 text-muted-foreground border border-dashed rounded-xl border-border/60 bg-muted/30 text-sm font-medium">
            لا توجد دورات تطابق بحثك عن &quot;{searchQuery}&quot;
          </div>
        )}
      </DataStateWrapper>
    </div>
  );
}
