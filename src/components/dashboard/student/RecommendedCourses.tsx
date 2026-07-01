'use client';

import { motion } from 'framer-motion';
import { Play, Star, Users } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export function RecommendedCourses() {
  const { recommendedCourses } = studentMockData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-lg font-bold text-foreground">مقترح لك</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recommendedCourses.map((course, idx) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + (idx * 0.1) }}
            className="group flex flex-col bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
          >
            <div className="relative h-40 w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{course.teacher}</p>
              
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                  <span className="font-medium text-foreground">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{course.students.toLocaleString()} طالب</span>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="font-bold text-primary">{course.price}</span>
                <button className="text-[11px] font-semibold bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-3 py-1.5 rounded-full transition-colors">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
