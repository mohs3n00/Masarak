'use client';

import { motion } from 'framer-motion';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export function StudyChartWidget() {
  const { weeklyChart } = studentMockData;
  const maxHours = Math.max(...weeklyChart.map(d => d.hours));

  // Arabic days mapping based on standard initials
  const arDays: Record<string, string> = {
    'Mon': 'الاثنين',
    'Tue': 'الثلاثاء',
    'Wed': 'الأربعاء',
    'Thu': 'الخميس',
    'Fri': 'الجمعة',
    'Sat': 'السبت',
    'Sun': 'الأحد'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-6 bg-card border border-border/60 rounded-2xl shadow-sm h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-base font-bold text-foreground">ساعات التعلم</h2>
          <span className="text-xs text-muted-foreground mt-0.5 block">هذا الأسبوع</span>
        </div>
        <div className="text-[11px] font-bold bg-success/10 text-success px-3 py-1.5 rounded-full">
          +12% عن الأسبوع الماضي
        </div>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-2 mt-auto pt-4">
        {weeklyChart.map((day, idx) => {
          const heightPercent = (day.hours / maxHours) * 100;
          return (
            <div key={idx} className="flex flex-col items-center gap-2 w-full group">
              <div className="relative w-full flex justify-center h-40 bg-muted/40 rounded-t-lg items-end pb-0 transition-colors group-hover:bg-muted/60">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + (idx * 0.05), ease: "easeOut" }}
                  className="w-full max-w-[28px] sm:max-w-[32px] bg-primary rounded-t-md relative transition-transform duration-300 group-hover:bg-primary/90"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs py-1 px-2 rounded-md whitespace-nowrap pointer-events-none font-medium shadow-md">
                    {day.hours} س
                  </div>
                </motion.div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium truncate w-full text-center group-hover:text-foreground transition-colors" title={arDays[day.day] || day.day}>
                {arDays[day.day] ? arDays[day.day].substring(0, 3) : day.day}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
