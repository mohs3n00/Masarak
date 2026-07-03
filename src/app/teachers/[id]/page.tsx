import React from 'react';
import { notFound } from 'next/navigation';
import { teachers, courses } from '@/mock';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { TeacherHeroHeader } from '@/features/marketing/components/hero/TeacherHeroHeader';
import { BundleCard } from '@/features/marketing/components/cards/BundleCard';

export default async function TeachersIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = teachers.find(t => t.id === id);
  
  if (!teacher) {
    notFound();
  }

  // Get courses for this teacher
  const teacherCourses = courses.filter(c => c.teacherId === teacher.id);
  
  // Split into mock bundles and individual courses
  const bundles = teacherCourses.slice(0, 2);
  const individualCourses = teacherCourses.slice(2);

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <TeacherHeroHeader teacher={teacher} />

      <AppContainer>
        {/* Bundles Section */}
        {bundles.length > 0 && (
          <Section className="pt-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                الاشتراك الشهري <span className="text-primary">للمدرس</span>
              </h2>
              <div className="h-px bg-border flex-1 ml-4 hidden sm:block" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundles.map(course => (
                <BundleCard key={course.id} course={course} teacher={teacher} isBundle={true} />
              ))}
            </div>
          </Section>
        )}

        {/* Individual Courses Section */}
        {individualCourses.length > 0 && (
          <Section className="pt-12">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                كورسات منفصلة <span className="text-[#DC2626]">للمدرس</span>
              </h2>
              <div className="h-px bg-border flex-1 ml-4 hidden sm:block" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {individualCourses.map(course => (
                <BundleCard key={course.id} course={course} teacher={teacher} isBundle={false} />
              ))}
            </div>
          </Section>
        )}
        {/* Empty State */}
        {bundles.length === 0 && individualCourses.length === 0 && (
          <Section className="pt-16">
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-3xl border border-border shadow-sm">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 text-4xl">
                🎓
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">لا توجد كورسات متاحة حالياً</h3>
              <p className="text-muted-foreground max-w-md">
                هذا المعلم لم يقم بنشر أي كورسات أو باقات حتى الآن. يرجى العودة لاحقاً أو استكشاف معلمين آخرين.
              </p>
            </div>
          </Section>
        )}
      </AppContainer>
    </div>
  );
}
