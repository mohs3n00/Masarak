import Link from 'next/link';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { TeacherPreviewCard } from '@/features/marketing/components/cards/TeacherCard';
import { GraduationCap, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TeacherSearchClient } from '@/features/marketing/components/filters/TeacherSearchClient';
import { fetchPublicTeachers, fetchPublicSubjects } from '@/lib/api/public';
import { AppPagination } from '@/shared/components/molecules/AppPagination';

const ITEMS_PER_PAGE = 12;

export default async function TeachersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const subjectIdFilter = typeof searchParams.subjectId === 'string' ? searchParams.subjectId : undefined;
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const page = typeof searchParams.page === 'string' ? Math.max(1, parseInt(searchParams.page) || 1) : 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [teachersResult, dbSubjects] = await Promise.all([
    fetchPublicTeachers({
      take: ITEMS_PER_PAGE,
      skip,
      q: query,
      subjectId: subjectIdFilter,
    }),
    fetchPublicSubjects(),
  ]);

  const { data: teachers, total: totalItems } = teachersResult;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Normalize subjects to prevent duplicates (e.g., "اللغة العربية" and "لغة عربية")
  const normalizedSubjects = dbSubjects.reduce((acc: any[], current: any) => {
    const normalize = (name: string) => name.replace(/^ال/, '').replace(/\s+/g, ' ').trim();
    const currentNormalized = normalize(current.name);
    
    const exists = acc.find(s => normalize(s.name) === currentNormalized);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

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
                نفتخر في مسارك بضم أفضل الخبراء والمعلمين في الوطن العربي لمساعدتك على تحقيق أهدافك التعليمية
                والمهنية.
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
                'px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-colors',
                !subjectIdFilter ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground hover:bg-muted',
              )}
            >
              الكل
            </Link>
            {normalizedSubjects.map((subject: any) => {
              const isActive = subjectIdFilter === subject.id;
              const params = new URLSearchParams();
              if (query) params.set('q', query);
              params.set('subjectId', subject.id);

              return (
                <Link
                  key={subject.id}
                  href={`/teachers?${params.toString()}`}
                  scroll={false}
                  className={cn(
                    'px-5 py-2 rounded-full font-medium text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm font-bold'
                      : 'bg-muted/50 text-foreground hover:bg-muted',
                  )}
                >
                  {subject.name}
                </Link>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TeacherPreviewCard
                  key={teacher.id}
                  teacher={{
                    id: teacher.id,
                    name: teacher.name,
                    specialization: teacher.specializations[0] || 'معلم',
                    avatar: teacher.avatar,
                    bio: teacher.bio,
                    rating: 0,
                    reviewsCount: 0,
                    studentsCount: teacher.studentsCount,
                    coursesCount: teacher.coursesCount,
                  } as any}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="font-bold text-foreground text-lg">لا يوجد معلمين</p>
                <p className="text-muted-foreground text-sm">
                  {query || subjectIdFilter
                    ? 'لا يوجد معلمين يطابقون معايير البحث'
                    : 'لا يوجد معلمين مسجلين في المنصة حالياً'}
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <AppPagination totalPages={totalPages} />
            </div>
          )}
        </Section>
      </AppContainer>
    </div>
  );
}