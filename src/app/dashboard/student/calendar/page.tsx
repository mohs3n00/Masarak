'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export default function StudentCalendarPage() {
  const data = studentMockData;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-12" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-2">تقويمي</h1>
          <p className="text-muted-foreground text-sm">تتبع جلسات البث المباشر والمواعيد النهائية وجدول دراستك.</p>
        </div>
        <div className="flex bg-muted/60 rounded-xl p-1 shrink-0 border border-border/50">
          <button className="px-4 py-2 bg-background shadow-sm rounded-lg text-sm font-bold text-foreground">شهر</button>
          <button className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">أسبوع</button>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">أكتوبر 2026</h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-foreground hover:bg-muted/60 rounded-full transition-colors">اليوم</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Mock Calendar Grid */}
        <div className="grid grid-cols-7 border-b border-border/60 bg-muted/20">
          {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] sm:text-xs font-bold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-card">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 2; // Offset for mock calendar layout
            const isCurrentMonth = dayNum > 0 && dayNum <= 31;
            const isToday = dayNum === 15;
            
            // Assign some mock events
            const hasLive = dayNum === 15;
            const hasExam = dayNum === 16;
            const hasLesson = dayNum === 18;

            return (
              <div key={i} className={`min-h-[100px] sm:min-h-[120px] p-1.5 sm:p-2 border-s border-b border-border/60 ${!isCurrentMonth ? 'bg-muted/10 opacity-50' : 'hover:bg-muted/30 transition-colors cursor-pointer group'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-colors ${isToday ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground group-hover:bg-muted/60'}`}>
                    {dayNum > 0 ? (dayNum <= 31 ? dayNum : dayNum - 31) : 30 + dayNum}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  {hasLive && (
                    <div className="px-1.5 py-1 text-[10px] sm:text-xs font-bold rounded-md bg-warning/10 text-warning border border-warning/20 truncate transition-transform hover:scale-[1.02]">
                      <span dir="ltr">7:00 PM</span> بث مباشر
                    </div>
                  )}
                  {hasExam && (
                    <div className="px-1.5 py-1 text-[10px] sm:text-xs font-bold rounded-md bg-error/10 text-error border border-error/20 truncate transition-transform hover:scale-[1.02]">
                      <span dir="ltr">10:00 AM</span> اختبار
                    </div>
                  )}
                  {hasLesson && (
                    <div className="px-1.5 py-1 text-[10px] sm:text-xs font-bold rounded-md bg-info/10 text-info border border-info/20 truncate transition-transform hover:scale-[1.02]">
                      <span dir="ltr">4:00 PM</span> مراجعة
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
