import { Metadata } from 'next';
import Link from 'next/link';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FAQAccordion } from '@/features/marketing/components/blocks/FAQAccordion';
import { SectionHeader } from '@/features/marketing/components/blocks/SectionHeader';
import { CategoryCard } from '@/features/marketing/components/cards/CategoryCard';
import Image from 'next/image';
import { CTASection } from '@/features/marketing/components/blocks/CTASection';
import { TeacherCard } from '@/shared/components/organisms/TeacherCard';
import { TeachersCarousel } from '@/features/marketing/components/blocks/TeachersCarousel';
import { HowItWorks } from '@/features/marketing/components/blocks/HowItWorks';
import { CoursesBySubjects } from '@/features/marketing/components/blocks/CoursesBySubjects';
import { CourseCard } from '@/features/student-experience/components/CourseCard';
import homeImage from '@/assets/images/home.png';
import newTeacherImage from '@/assets/images/new.jpeg';
import ctaImage from '@/assets/images/teacher_whiteboard.png';
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
  const [popularCoursesResult, newestCoursesResult, teachersResult, categoriesResult] = await Promise.all([
    fetchPublicCourses({ take: 4, sort: 'popular', token }),
    fetchPublicCourses({ take: 4, sort: 'newest', token }),
    fetchPublicTeachers({ take: 4 }),
    fetchPublicCategories(),
  ]);

  const featuredCourses = popularCoursesResult.data;
  const latestCourses = newestCoursesResult.data;
  const featuredTeachers = teachersResult.data;
  const categories = categoriesResult.slice(0, 8);

  return (
    <div className="relative overflow-hidden w-full">
      {/* 1. HERO SECTION */}
      <div className="relative w-full min-h-[90vh] flex items-center justify-center pt-32 pb-16 overflow-hidden bg-background">
        {/* Background Image with opacity */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={homeImage} 
            alt="Hero Background" 
            fill
            className="object-cover opacity-[0.15]"
            priority
          />
          {/* Optional gradient overlay for smooth transition to next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background" />
        </div>

        <AppContainer className="z-10 relative">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-display text-foreground mb-6 font-bold leading-tight">
              منصة متكاملة بها كل ما
              <br />
              يحتاجه <span className="text-primary">الطالب ليتفوق</span>
            </h1>
            <p className="text-body-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed font-medium">
              منصة متكاملة بتساعدك تذاكر صح، تختار مدرسينك، وتوصل لأعلى درجاتك في الثانوية العامة بكل سهولة وراحة.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto mt-4">
              <Link
                href="/choose-account"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'rounded-full px-12 py-7 text-xl font-bold w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all',
                )}
              >
                ابدأ رحلتك
              </Link>
            </div>
          </div>
        </AppContainer>
      </div>

      {/* 2. POPULAR TEACHERS */}
      <div className="bg-primary w-full overflow-hidden pt-20 md:pt-24 pb-20">
        <AppContainer>
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 mb-8 px-4">
            <div className="text-right max-w-2xl text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                المدرسين عندنا مش زي أي مدرسين!
              </h2>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                في مسارك، اخترنالك نخبة من أفضل المدرسين في مصر. كل واحد فيهم عنده خبرة كبيرة، وطريقة شرح سهلة، وبيفهمك المعلومة من أول مرة!
              </p>
            </div>
          </div>
        </AppContainer>
        <div className="w-full">
          <TeachersCarousel teachers={featuredTeachers} />
        </div>
      </div>

      {/* 3. HOW IT WORKS */}
      <HowItWorks />

      {/* 4. COURSES BY SUBJECT */}
      <CoursesBySubjects categories={categories} />

      {/* 5. RECOMMENDED LECTURES */}
      <AppContainer>
        <Section className="py-20 bg-background">
          <SectionHeader
            badge="المحاضرات المقترحة"
            title="كورسات مختارة مخصوص ليك"
            subtitle="ريحنا دماغك وجمعنا لك كورسات على مزاجك. مختارة بحب وعناية كأننا بنعمل شوبينج لأحسن شوية كورسات تساعدك وتلملك الدنيا!"
          />
          {featuredCourses && featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {featuredCourses.slice(0, 4).map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  teacher={course.teacher?.name || 'مدرس مسارك'}
                  teacherAvatar={course.teacher?.avatar || ''}
                  thumbnail={course.thumbnailUrl || ''}
                  subject={course.category?.name || ''}
                  grade={course.grade}
                  price={course.price}
                  originalPrice={course.originalPrice}
                  totalLessons={course.lessonsCount || 0}
                />
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-8 flex items-center justify-center gap-3 mt-8">
              <span className="text-2xl">⚠️</span>
              <p className="font-bold">سيتم اضافه المحاضرات قريباً...</p>
            </div>
          )}
          <div className="flex justify-center mt-10">
            <Link href="/courses" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-colors">
              عرض الكل
            </Link>
          </div>
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
              title="عايز تنضم لينا في فريق مسارك؟"
              description="يمكنك الآن الانضمام لفريق المعلمين على المنصة، والمشاركة في تدريس المناهج التعليمية للصفوف الثانوية والمساهمة في تطوير المنصة وتعليم الطلاب بأفضل طريقة ممكنة!"
              primaryAction={{ label: 'ابدأ رحلتك الآن', href: '/register/teacher' }}
              imageSrc={newTeacherImage}
            />
          </AnimatedDiv>
        </Section>
      </AppContainer>
    </div>
  );
}
