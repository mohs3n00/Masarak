import React from 'react';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { SubjectCard } from '@/features/marketing/components/cards/SubjectCard';
import { PublicCategory } from '@/lib/api/public';

interface CoursesBySubjectsProps {
  categories: PublicCategory[];
}

export function CoursesBySubjects({ categories }: CoursesBySubjectsProps) {
  return (
    <div className="bg-muted/30 w-full overflow-hidden border-t border-border/50">
      <AppContainer>
        <Section className="py-20 md:py-24">
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="text-right max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">
                كورسات مختارة مخصوص ليك
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                ريحنا دماغك وجمعنا لك كورسات على مزاجك، مختارة بحب وعناية كأننا بنعمل شوبينج لأحسن شوية كورسات تساعدك وتنميك!
              </p>
            </div>
            
            {/* Optional: Filter by Grade if needed */}
            <div className="flex-shrink-0">
              <select className="bg-background border border-border text-foreground px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">اختر الصف الدراسي</option>
                <option value="1">الصف الأول الثانوي</option>
                <option value="2">الصف الثاني الثانوي</option>
                <option value="3">الصف الثالث الثانوي</option>
              </select>
            </div>
          </div>

          <AnimatedDiv variant="staggerContainer" className="flex overflow-x-auto gap-6 pb-6 pt-4 snap-x snap-mandatory" dir="rtl">
            {categories.map((category) => (
              <SubjectCard key={category.id} category={category} className="min-w-[280px] w-[280px] shrink-0 snap-start" />
            ))}
            
            {categories.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                لا توجد مواد حالياً
              </div>
            )}
          </AnimatedDiv>

        </Section>
      </AppContainer>
    </div>
  );
}
