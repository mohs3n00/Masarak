'use client';

import React from 'react';
import { useApi } from '@/lib/providers/ApiProvider';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { FileText, Search, BookOpen, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function NotesPage() {
  const { dataState } = useApi();
  const notes = dataState === 'empty' ? [] : studentMockData.quickNotes;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ملاحظاتي</h1>
          <p className="text-muted-foreground text-sm">راجع وأدِر ملاحظاتك الدراسية عبر جميع الدورات.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث في الملاحظات..."
            className="w-full bg-card border border-border/60 rounded-xl ps-11 pe-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all placeholder:text-muted-foreground text-foreground"
          />
        </div>
      </div>

      <DataStateWrapper emptyType="document" emptyMessage="لم تقم بكتابة أي ملاحظات بعد. اكتب ملاحظاتك داخل مشغل الدورة لتراها هنا.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note.id} className="bg-card border border-border/60 rounded-3xl p-6 hover:border-warning/30 hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative">
              <div className="absolute top-6 end-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col pe-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md inline-block w-fit">
                    {note.date}
                  </span>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed flex-1 text-sm font-medium">
                &quot;{note.content}&quot;
              </p>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <BookOpen className="w-4 h-4" /> الانتقال للدرس
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-muted/60 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 bg-muted/60 rounded-md hover:bg-error hover:text-error-foreground transition-colors shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DataStateWrapper>
    </div>
  );
}
