'use client';

import React from 'react';
import { AppContainer } from '@/shared/layouts/Containers';
import { Search, BookOpen, GraduationCap, CreditCard, Laptop, ArrowLeft, MessageSquare, LifeBuoy } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Link from 'next/link';

const categories = [
  {
    id: 'students',
    title: 'دليل الطالب',
    description: 'كل ما تحتاجه لبدء رحلتك التعليمية على المنصة',
    icon: BookOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    id: 'teachers',
    title: 'دليل المعلم',
    description: 'كيف تدير كورساتك وطلابك بفعالية',
    icon: GraduationCap,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  {
    id: 'billing',
    title: 'الحساب والفواتير',
    description: 'إدارة اشتراكاتك، طرق الدفع واسترجاع الأموال',
    icon: CreditCard,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    id: 'technical',
    title: 'الدعم التقني',
    description: 'حلول للمشاكل التقنية التي قد تواجهك',
    icon: Laptop,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  }
];

const faqs = [
  {
    id: 'faq-1',
    question: 'كيف يمكنني الاشتراك في كورس جديد؟',
    answer: 'يمكنك تصفح الكورسات المتاحة من خلال صفحة "الكورسات"، ثم النقر على الكورس الذي تريده واختيار "الاشتراك الآن". سيتم توجيهك إلى صفحة الدفع لإتمام العملية.'
  },
  {
    id: 'faq-2',
    question: 'ما هي طرق الدفع المتاحة على المنصة؟',
    answer: 'ندعم حالياً الدفع عبر البطاقات الائتمانية (فيزا، ماستركارد)، المحافظ الإلكترونية (مثل فودافون كاش)، بالإضافة إلى الدفع عن طريق فوري.'
  },
  {
    id: 'faq-3',
    question: 'نسيت كلمة المرور، ماذا أفعل؟',
    answer: 'يمكنك النقر على "نسيت كلمة المرور" في صفحة تسجيل الدخول، وإدخال بريدك الإلكتروني. سيتم إرسال رابط لإعادة تعيين كلمة المرور إلى صندوق الوارد الخاص بك.'
  },
  {
    id: 'faq-4',
    question: 'هل يمكنني استرجاع أموالي إذا لم يعجبني الكورس؟',
    answer: 'نعم، نوفر سياسة استرجاع الأموال خلال أول 7 أيام من تاريخ الاشتراك في الكورس، بشرط عدم مشاهدة أكثر من 20% من محتوى الكورس.'
  },
  {
    id: 'faq-5',
    question: 'كيف يمكنني التحدث مع الدعم الفني بشكل مباشر؟',
    answer: 'يمكنك استخدام أيقونة المحادثة الموجودة أسفل يمين الشاشة للتحدث مع فريق الدعم مباشرة، أو التواصل معنا عبر صفحتنا على فيسبوك.'
  }
];

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <div className="bg-primary pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-40 -start-40 w-96 h-96 bg-white/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-20 -end-20 w-72 h-72 bg-white/10 blur-[80px] rounded-full pointer-events-none"></div>

        <AppContainer className="relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              كيف يمكننا مساعدتك اليوم؟
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-xl mx-auto font-medium">
              ابحث في قاعدة المعرفة، أو تصفح المقالات للحصول على إجابات لأسئلتك.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 relative max-w-xl mx-auto group">
              <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center">
                <Search className="absolute start-5 w-6 h-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="ابحث عن سؤالك هنا... (مثال: طريقة الدفع)"
                  className="w-full h-16 ps-14 pe-6 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 shadow-xl border-none outline-none focus:ring-4 focus:ring-primary-hover/30 text-lg transition-all"
                />
              </div>
            </div>
          </div>
        </AppContainer>
      </div>

      <AppContainer className="mt-12 space-y-20">
        {/* Categories Section */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-foreground mb-3">تصفح حسب الفئة</h2>
            <p className="text-text-muted">اختر الفئة التي تناسب استفسارك للوصول السريع</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group bg-card border border-border/60 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer flex flex-col items-start"
              >
                <div className={`w-14 h-14 rounded-2xl ${category.bgColor} ${category.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  {category.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span>تصفح المقالات</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3">الأسئلة الشائعة</h2>
            <p className="text-text-muted">أكثر الأسئلة التي تصلنا من المستخدمين</p>
          </div>

          <Accordion>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="mb-4 bg-card border border-border/60 rounded-2xl overflow-hidden">
                <AccordionTrigger className="text-lg font-bold text-foreground py-5 px-6 hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-text-secondary leading-relaxed px-6 pb-6 text-[15px]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact Support */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 end-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 start-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                <LifeBuoy className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-foreground mb-4">لم تجد إجابة لسؤالك؟</h2>
              <p className="text-text-muted max-w-lg mx-auto mb-8 text-lg">
                فريق الدعم الفني متواجد لمساعدتك في أي وقت. تواصل معنا وسنقوم بالرد عليك في أقرب وقت ممكن.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {
                    const chatButton = document.querySelector('[aria-label="Toggle Support Chat"]') as HTMLButtonElement;
                    if (chatButton) chatButton.click();
                  }}
                  className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary-hover transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  محادثة مباشرة
                </button>
                <Link
                  href="mailto:support@masarak.tech"
                  className="px-8 py-4 bg-card border border-border/80 text-foreground font-bold rounded-2xl hover:bg-muted transition-all flex items-center justify-center gap-2"
                >
                  مراسلة عبر البريد
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AppContainer>
    </div>
  );
}
