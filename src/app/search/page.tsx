'use client';

import React, { useState } from 'react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { CourseCard } from '@/features/student-experience/components/CourseCard';
import { AppContainer } from '@/shared/layouts/Containers';
import { Search as SearchIcon, Filter, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { useApi } from '@/lib/providers/ApiProvider';

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { dataState } = useApi();

  const courses = dataState === 'empty' ? [] : studentMockData.recommendedCourses;

  return (
    <div className="pb-20 pt-10">
      <AppContainer>
        {/* Search Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Explore Courses</h1>
          <p className="text-lg text-text-secondary mb-8">
            Find the perfect course to advance your skills and knowledge.
          </p>

          <div className="relative w-full shadow-lg rounded-2xl">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-2 border-border rounded-2xl pl-16 pr-6 py-5 text-lg font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-card border border-border/50 rounded-3xl p-6 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <h3 className="font-bold flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
                <button className="text-xs font-bold text-primary hover:underline">Clear all</button>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-bold text-sm mb-3 text-text-secondary uppercase tracking-wider">Category</h4>
                  <div className="flex flex-col gap-2">
                    {['Mathematics', 'Physics', 'Chemistry', 'Languages', 'Biology'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background" />
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-3 text-text-secondary uppercase tracking-wider">Level</h4>
                  <div className="flex flex-col gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                      <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background" />
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm mb-3 text-text-secondary uppercase tracking-wider">Rating</h4>
                  <div className="flex flex-col gap-2">
                    {[4.5, 4.0, 3.5].map(rating => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 bg-background" />
                        <span className="text-sm font-medium group-hover:text-primary transition-colors">{rating}+ Stars</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-3 rounded-2xl border border-border/50">
              <span className="text-sm font-bold text-text-secondary px-2">
                Showing <span className="text-foreground">{courses.length}</span> results
              </span>
              
              <div className="flex items-center gap-4">
                <select className="bg-card border-2 border-border/50 rounded-xl px-4 h-[52px] text-sm font-medium focus:outline-none focus:border-primary">
                  <option>Most Relevant</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                </select>

                <div className="flex bg-card border border-border rounded-xl p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-1.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-1.5 rounded-lg transition-all", viewMode === 'list' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <DataStateWrapper emptyType="search" emptyMessage="No courses found matching your criteria. Try adjusting your filters or search query.">
              <div className={cn(
                "grid gap-6",
                viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {courses.map((course, idx) => (
                  <CourseCard 
                    key={idx} 
                    id={course.id}
                    title={course.title}
                    teacher={course.teacher}
                    thumbnail={course.thumbnail}
                    isEnrolled={false}
                    price={Number(course.price.replace(/[^0-9.-]+/g,""))}
                    rating={course.rating}
                    studentsCount={course.students}
                    totalLessons={20}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </DataStateWrapper>
          </div>
        </div>
      </AppContainer>
    </div>
  );
}
