'use client';

import React from 'react';
import { useApi } from '@/lib/providers/ApiProvider';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { FileText, Download, Search, HardDrive } from 'lucide-react';

export default function DownloadsPage() {
  const { dataState } = useApi();
  const downloads = dataState === 'empty' ? [] : [
    { id: 'd1', name: 'ملخص التفاضل والتكامل.pdf', size: '2.4 MB', course: 'الرياضيات المتقدمة', date: '15 أكتوبر' },
    { id: 'd2', name: 'تدريبات الفصل الثاني.docx', size: '1.1 MB', course: 'الرياضيات المتقدمة', date: '14 أكتوبر' },
    { id: 'd3', name: 'قوانين الديناميكا الحرارية.pdf', size: '3.5 MB', course: 'الفيزياء', date: '10 أكتوبر' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">التنزيلات</h1>
          <p className="text-muted-foreground text-sm">أدر جميع الموارد والملفات التي قمت بتنزيلها من الدورات.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث في الملفات..."
            className="w-full bg-card border border-border/60 rounded-xl ps-11 pe-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all placeholder:text-muted-foreground text-foreground"
          />
        </div>
      </div>

      <DataStateWrapper emptyType="downloads" emptyMessage="لم تقم بتنزيل أي موارد بعد. تحقق من مواد الدورة للحصول على الملفات المتاحة.">
        <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
          
          <div className="p-5 sm:p-6 border-b border-border/60 bg-muted/20 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2 text-foreground">
              <HardDrive className="w-5 h-5 text-primary" /> مساحة التخزين المستخدمة
            </h2>
            <span className="text-xs sm:text-sm font-bold text-muted-foreground" dir="ltr">7.0 MB total</span>
          </div>

          <div className="flex flex-col">
            {downloads.map(file => (
              <div key={file.id} className="flex items-center justify-between p-5 sm:p-6 border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">{file.name}</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground mt-1">
                      <span className="font-medium text-foreground/80">{file.course}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span dir="ltr">{file.size}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{file.date}</span>
                    </div>
                  </div>
                </div>
                
                <button className="p-2 sm:p-3 bg-muted/60 rounded-xl text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 shadow-sm">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </DataStateWrapper>
    </div>
  );
}
