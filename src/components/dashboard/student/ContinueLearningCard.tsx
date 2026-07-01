'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export function ContinueLearningCard() {
  const { continueLearning: course } = studentMockData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      className="flex flex-col gap-4"
    >
      <div className="flex justify-between items-end">
        <h2 className="text-lg font-bold text-foreground">متابعة التعلم</h2>
      </div>

      <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 shadow-sm transition-all hover:shadow-md hover:border-primary/40 cursor-pointer">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 md:w-2/5 relative h-48 sm:h-auto bg-muted overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <Play className="h-5 w-5 text-primary-foreground ms-1" />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-5 sm:p-6 w-full">
            <div>
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2">
                  {course.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">{course.teacher}</p>

              <div className="mt-4 p-3 bg-muted/40 rounded-xl border border-border/50 flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-muted-foreground">الدرس التالي</span>
                <span className="text-sm font-medium text-foreground line-clamp-1">{course.currentLesson}</span>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col gap-2.5">
              <div className="flex justify-between text-xs sm:text-sm font-medium">
                <span className="text-muted-foreground">نسبة الإنجاز</span>
                <span className="text-foreground font-bold">{course.progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-primary rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                </motion.div>
              </div>
              <span className="text-[10px] text-muted-foreground">متبقي {course.remainingTime}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
