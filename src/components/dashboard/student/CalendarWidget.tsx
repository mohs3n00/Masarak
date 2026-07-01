'use client';

import { motion } from 'framer-motion';
import { Video, FileText, HelpCircle } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export function CalendarWidget() {
  const { upcomingLessons } = studentMockData;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LIVE': return <Video className="h-4 w-4 text-error" />;
      case 'EXAM': return <HelpCircle className="h-4 w-4 text-warning" />;
      case 'LESSON': return <FileText className="h-4 w-4 text-info" />;
      default: return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LIVE': return 'bg-error/10 border-error/20 text-error';
      case 'EXAM': return 'bg-warning/10 border-warning/20 text-warning';
      case 'LESSON': return 'bg-info/10 border-info/20 text-info';
      default: return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'LIVE': return 'بث مباشر';
      case 'EXAM': return 'اختبار';
      case 'LESSON': return 'درس مسجل';
      default: return 'نشاط';
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="p-6 bg-card border border-border/60 rounded-2xl shadow-sm h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-foreground">الجدول القادم</h2>
        <button className="text-[11px] font-semibold text-primary hover:underline transition-colors">عرض التقويم</button>
      </div>

      <div className="flex flex-col gap-4">
        {upcomingLessons.map((lesson) => (
          <div key={lesson.id} className="flex items-start gap-3 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-muted/40 transition-colors">
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-110 ${getTypeColor(lesson.type)}`}>
              {getTypeIcon(lesson.type)}
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{lesson.title}</span>
                <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{lesson.time}</span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 font-medium">{getTypeName(lesson.type)}</span>
            </div>
          </div>
        ))}

        {upcomingLessons.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            لا توجد دروس قادمة هذا الأسبوع.
          </div>
        )}
      </div>
    </motion.div>
  );
}
