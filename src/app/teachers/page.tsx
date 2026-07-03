import Link from "next/link";
import { AppContainer, Section } from "@/shared/layouts/Containers";
import { TeacherPreviewCard } from "@/features/marketing/components/cards/TeacherPreviewCard";
import { teachers } from "@/mock";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

import { TeacherSearchClient } from "@/features/marketing/components/filters/TeacherSearchClient";

const SUBJECTS = ['برمجة', 'تصميم', 'لغات', 'تسويق', 'رياضيات', 'فيزياء'];

export default async function TeachersPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;

  const subjectFilter = typeof searchParams.subject === 'string' ? searchParams.subject : null;
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    if (subjectFilter && teacher.specialization !== subjectFilter) return false;
    
    if (query) {
      if (!teacher.name.toLowerCase().includes(query) && !teacher.specialization.toLowerCase().includes(query)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-card border-b border-border relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <AppContainer>
          <div className="py-12 md:py-16 flex flex-col items-center text-center gap-6 relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-2">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-4 items-center">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                تعرف على نخبة المعلمين
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                نفتخر في مسارك بضم أفضل الخبراء والمعلمين في الوطن العربي لمساعدتك على تحقيق أهدافك التعليمية والمهنية.
              </p>
            </div>

            {/* Search Bar */}
            <TeacherSearchClient />
          </div>
        </AppContainer>
      </div>

      <AppContainer>
        <Section className="pt-12">
          {/* Subjects Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link 
              href={query ? `/teachers?q=${query}` : '/teachers'}
              scroll={false}
              className={cn(
                "px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-colors",
                !subjectFilter ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground hover:bg-muted"
              )}
            >
              الكل
            </Link>
            {SUBJECTS.map((subject, idx) => {
              const isActive = subjectFilter === subject;
              const params = new URLSearchParams();
              if (query) params.set('q', query);
              params.set('subject', subject);
              
              return (
                <Link 
                  key={idx} 
                  href={`/teachers?${params.toString()}`}
                  scroll={false}
                  className={cn(
                    "px-5 py-2 rounded-full font-medium text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground shadow-sm font-bold" : "bg-muted/50 text-foreground hover:bg-muted"
                  )}
                >
                  {subject}
                </Link>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TeacherPreviewCard key={teacher.id} teacher={teacher} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                لا يوجد معلمين يطابقون معايير البحث
              </div>
            )}
          </div>

        </Section>
      </AppContainer>
    </div>
  );
}