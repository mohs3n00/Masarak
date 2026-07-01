'use client';

import { useApi } from '@/lib/providers/ApiProvider';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { Award, Download, ShieldCheck, Search, Share2 } from 'lucide-react';

export default function CertificatesPage() {
  const { dataState } = useApi();
  const certificates = dataState === 'empty' ? [] : studentMockData.certificates;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-12" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">الشهادات</h1>
          <p className="text-muted-foreground text-sm">اعرض، وحمّل، وشارك الشهادات التي حصلت عليها.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث في الشهادات..."
            className="w-full bg-card border border-border/60 rounded-xl ps-11 pe-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all placeholder:text-muted-foreground text-foreground"
          />
        </div>
      </div>

      <DataStateWrapper emptyType="document" emptyMessage="لم تحصل على أي شهادات بعد. أكمل الدورات لتربح الشهادات.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-card border border-border/60 rounded-3xl p-6 flex flex-col gap-6 hover:border-success/30 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
              <div className="absolute -start-8 -top-8 w-32 h-32 bg-success/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="w-14 h-14 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-center text-success shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7" />
                </div>
                {cert.verified && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    موثقة
                  </div>
                )}
              </div>
              
              <div className="relative z-10">
                <h3 className="font-bold text-lg leading-tight mb-3 group-hover:text-success transition-colors">{cert.title}</h3>
                <div className="flex flex-col gap-2.5 text-xs text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/60">
                  <div className="flex justify-between items-center">
                    <span>تاريخ الإصدار</span>
                    <span className="font-bold text-foreground" dir="ltr">{cert.issueDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الدرجة النهائية</span>
                    <span className="font-black text-success">{cert.grade}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border/60 flex items-center gap-3 relative z-10">
                <button className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-success text-success-foreground rounded-xl font-bold text-xs hover:bg-success/90 transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> تحميل
                </button>
                <button className="flex justify-center items-center px-4 py-2.5 bg-muted/60 text-foreground rounded-xl font-bold hover:bg-muted transition-colors border border-border/50">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </DataStateWrapper>
    </div>
  );
}
