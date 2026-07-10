import React from 'react';
import { AppContainer } from '@/shared/layouts/Containers';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { masarakKnowledge } from '@/features/support/knowledge/masarakKnowledge';

export const metadata = {
  title: 'الأسئلة الشائعة | مسارك',
  description: 'إجابات على الأسئلة الأكثر شيوعاً حول استخدام منصة مسارك.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <AppContainer>
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              الأسئلة الشائعة
            </h1>
            <p className="text-lg text-text-muted">
              كل ما تحتاج معرفته عن استخدام المنصة، الاشتراكات، والدعم الفني.
            </p>
          </div>

          <div className="space-y-4">
            {masarakKnowledge.map((item, index) => (
              <details
                key={index}
                className="group bg-card border border-border rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer text-foreground font-bold hover:bg-muted/30 transition-colors">
                  {item.question}
                  <ChevronDown className="w-5 h-5 text-text-muted group-open:-rotate-180 transition-transform duration-300" />
                </summary>
                <div className="p-6 pt-0 text-text-muted leading-relaxed border-t border-border mt-2 bg-muted/10">
                  <p className="mt-4">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-3xl p-8 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 w-64 h-64 rounded-full -top-32 -right-32 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold">لم تجد إجابة لسؤالك؟</h2>
              <p className="text-white/80 max-w-lg mx-auto">
                يمكنك التواصل مع فريق الدعم الفني لمسارك، أو التحدث مع &quot;مساعد مسارك الذكي&quot; عبر أيقونة المحادثة أسفل الشاشة.
              </p>
              <div className="pt-4">
                <a
                  href="/contact"
                  className="inline-block px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors"
                >
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>

        </div>
      </AppContainer>
    </div>
  );
}
