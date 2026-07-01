'use client';

import { useApi } from '@/lib/providers/ApiProvider';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { Bookmark, Search, Clock, PlayCircle, FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const { dataState } = useApi();
  const bookmarks = dataState === 'empty' ? [] : studentMockData.bookmarks;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">المحفوظات</h1>
          <p className="text-muted-foreground text-sm">الوصول السريع إلى الدروس واللحظات المهمة التي حفظتها.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث في المحفوظات..."
            className="w-full bg-card border border-border/60 rounded-xl ps-11 pe-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
          />
        </div>
      </div>

      <DataStateWrapper emptyType="bookmarks" emptyMessage="لم تقم بحفظ أي شيء بعد. احفظ اللحظات المهمة في مشغل الدورة لتجدها بسهولة لاحقاً.">
        <div className="flex flex-col gap-4">
          {bookmarks.map(bookmark => (
            <Link href="#" key={bookmark.id} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden">
              <div className="absolute start-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
              
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {bookmark.type === 'video' ? <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : <FileText className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>
                <div className="flex flex-col justify-center h-auto sm:h-12">
                  <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors">{bookmark.title}</h3>
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-1.5">
                    <span className="font-medium text-foreground">{bookmark.course}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1 font-mono text-[10px] sm:text-xs font-bold bg-muted/60 px-2 py-0.5 rounded-md" dir="ltr">
                      <Clock className="w-3.5 h-3.5" /> {bookmark.time}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="text-primary hover:text-error transition-colors p-2 shrink-0">
                  <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                </button>
                <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 hidden sm:block" />
              </div>
            </Link>
          ))}
        </div>
      </DataStateWrapper>
    </div>
  );
}
