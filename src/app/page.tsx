import { Metadata } from 'next';
import Link from 'next/link';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FAQAccordion } from '@/features/marketing/components/blocks/FAQAccordion';
import { SectionHeader } from '@/features/marketing/components/blocks/SectionHeader';
import { CategoryCard } from '@/features/marketing/components/cards/CategoryCard';
import { HeroBackground } from '@/features/marketing/components/hero/HeroBackground';
import { HeroImage } from '@/features/marketing/components/hero/HeroImage';
import { CTASection } from '@/features/marketing/components/blocks/CTASection';
import { CourseCard } from '@/features/student-experience/components/CourseCard';
import { TeacherCard } from '@/shared/components/organisms/TeacherCard';
import homeStartImage from '@/assets/images/home start.png';
import { fetchPublicCourses, fetchPublicTeachers, fetchPublicCategories } from '@/lib/api/public';
import { faqs as defaultFaqs } from '@/mock/faq';
import { ArrowLeft, BookOpen, GraduationCap, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'مسارك | منصة ثانوية عامة',
  description: 'منصة مسارك التعليمية، كل ما يحتاجه طالب الثانوية العامة في مكان واحد.',
};

function EmptySection({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center gap-3 bg-muted/30 rounded-2xl border border-dashed border-border">
      <Icon className="w-10 h-10 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground font-medium">لا يوجد {label} منشور حالياً</p>
    </div>
  );
}

import { cookies } from 'next/headers';

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || cookieStore.get('access_token')?.value;

  // Fetch everything in parallel
  const [popularCoursesResult, newestCoursesResult, teachersResult] = await Promise.all([
    fetchPublicCourses({ take: 4, sort: 'popular', token }),
    fetchPublicCourses({ take: 4, sort: 'newest', token }),
    fetchPublicTeachers({ take: 4 }),
  ]);

  const featuredCourses = popularCoursesResult.data;
  const latestCourses = newestCoursesResult.data;
  const featuredTeachers = teachersResult.data;

  return (
    <div className="relative overflow-hidden w-full">
      <HeroBackground />

      {/* 1. HERO SECTION */}
      <AppContainer>
        <Section className="pt-28 md:pt-40 pb-20 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="flex flex-col items-start text-start order-2 lg:order-1">
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.2] mb-6 text-foreground">
                <span className="text-primary">مسارك</span>
                <br />
                نحو التفوق
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-lg font-medium">
                منصة مسارك التعليمية، كل ما يحتاجه طالب الثانوية العامة في مكان واحد لتحقيق حلمه.
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="/courses"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'rounded-2xl px-12 font-bold h-14 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all',
                  )}
                >
                  تصفح الكورسات
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end items-center order-1 lg:order-2 w-full aspect-[4/3] min-h-[400px]">
              <HeroImage
                src={homeStartImage}
                alt="طالب ثانوية عامة"
                className="w-full max-w-[700px] h-full object-contain scale-110"
              />
            </div>
          </div>
        </Section>
      </AppContainer>

      {/* 2. FEATURED COURSES */}
      <div className="bg-muted/30 border-y border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                badge="الكورسات"
                title="أشهر الكورسات"
                subtitle="أكثر الكورسات مبيعاً على منصة مسارك"
                align="left"
                className="mb-0 max-w-lg"
              />
              <Link href="/courses" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 pb-1">
                عرض الكل <ArrowLeft className="w-4 h-4 flip-rtl" />
              </Link>
            </div>
            <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCourses.length > 0 ? (
                featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    teacher={course.teacher?.name || ''}
                    teacherAvatar={course.teacher?.avatar || ''}
                    thumbnail={course.thumbnailUrl || ''}
                    subject={course.category?.name || ''}
                    totalLessons={course.lessonsCount}
                    rating={course.averageRating}
                    studentsCount={course.enrollmentCount}
                    price={Number(course.price)}
                    originalPrice={course.originalPrice ? Number(course.originalPrice) : undefined}
                  />
                ))
              ) : (
                <EmptySection icon={BookOpen} label="كورس" />
              )}
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* 3. POPULAR TEACHERS */}
      <AppContainer>
        <Section className="py-20 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              badge="المعلمون"
              title="أشهر المدرسين"
              subtitle="نخبة من أفضل مدرسين الثانوية العامة في مصر"
              align="left"
              className="mb-0 max-w-lg"
            />
            <Link href="/teachers" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 pb-1">
              عرض الكل <ArrowLeft className="w-4 h-4 flip-rtl" />
            </Link>
          </div>
          <AnimatedDiv variant="staggerContainer" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTeachers.length > 0 ? (
              featuredTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  id={teacher.id}
                  name={teacher.name}
                  subject={teacher.specializations[0] || ''}
                  avatar={teacher.avatar || ''}
                  bio={teacher.bio || ''}
                  studentsCount={teacher.studentsCount}
                  coursesCount={teacher.coursesCount}
                />
              ))
            ) : (
              <EmptySection icon={GraduationCap} label="مدرس" />
            )}
          </AnimatedDiv>
        </Section>
      </AppContainer>



      {/* 5. LATEST COURSES */}
      <AppContainer>
        <Section className="py-20 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              badge="جديد"
              title="أحدث الكورسات"
              subtitle="كورسات لسه نازلة جديد، ابدأ معاها من الأول"
              align="left"
              className="mb-0 max-w-lg"
            />
            <Link href="/courses" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 pb-1">
              عرض الكل <ArrowLeft className="w-4 h-4 flip-rtl" />
            </Link>
          </div>
          <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestCourses.length > 0 ? (
              latestCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  teacher={course.teacher?.name || ''}
                  teacherAvatar={course.teacher?.avatar || ''}
                  thumbnail={course.thumbnailUrl || ''}
                  subject={course.category?.name || ''}
                  totalLessons={course.lessonsCount}
                  rating={course.averageRating}
                  studentsCount={course.enrollmentCount}
                  price={Number(course.price)}
                  originalPrice={course.originalPrice ? Number(course.originalPrice) : undefined}
                />
              ))
            ) : (
              <EmptySection icon={BookOpen} label="كورس" />
            )}
          </AnimatedDiv>
        </Section>
      </AppContainer>



      {/* 6. FAQ */}
      <div className="bg-muted/30 border-t border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <SectionHeader
              badge="الأسئلة الشائعة"
              title="عندك استفسار؟"
              subtitle="إجابات واضحة لأكتر الأسئلة اللي بتهمك كطالب"
            />
            <AnimatedDiv variant="fadeUp" className="max-w-2xl mx-auto">
              <FAQAccordion items={defaultFaqs.slice(0, 5)} />
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* 7. CTA SECTION */}
      <AppContainer>
        <Section className="pb-20 md:pb-24 pt-10">
          <AnimatedDiv variant="fadeUp">
            <CTASection
              title="جاهز تبدأ تذاكر صح؟"
              description="انضم لآلاف طلاب الثانوية العامة اللي بيعتمدوا على مسارك في مذاكرتهم."
              primaryAction={{ label: 'اعمل حساب مجاني', href: '/register/student' }}
            />
          </AnimatedDiv>
        </Section>
      </AppContainer>
    </div>
  );
}
