import { Metadata } from 'next';
import Link from 'next/link';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Button } from '@/components/ui/button';
import { FAQAccordion } from '@/features/marketing/components/blocks/FAQAccordion';
import { SectionHeader } from '@/features/marketing/components/blocks/SectionHeader';
import { CategoryCard } from '@/features/marketing/components/cards/CategoryCard';
import { TestimonialCard } from '@/features/marketing/components/cards/TestimonialCard';
import { HeroBackground } from '@/features/marketing/components/hero/HeroBackground';
import { HeroImage } from '@/features/marketing/components/hero/HeroImage';
import { CTASection } from '@/features/marketing/components/blocks/CTASection';
import { CourseCard } from '@/features/student-experience/components/CourseCard';
import { TeacherCard } from '@/shared/components/organisms/TeacherCard';
import homeStartImage from '@/assets/images/home start.png';

import { courses, teachers, categories, faqs, testimonials } from '@/mock';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'مسارك | منصة ثانوية عامة',
  description: 'منصة مسارك التعليمية، كل ما يحتاجه طالب الثانوية العامة في مكان واحد.',
};

export default function LandingPage() {
  const featuredCourses = courses.slice(0, 4);
  const latestCourses = courses.slice(4, 8);
  const revisionCourses = courses.slice(2, 6);
  const featuredTeachers = teachers.slice(0, 4);
  const featuredCategories = categories.slice(0, 8);

  return (
    <div className="relative overflow-hidden w-full">
      <HeroBackground />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="pt-28 md:pt-40 pb-20 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Right: Copy (Since RTL) */}
            <div className="flex flex-col items-start text-start order-2 lg:order-1">
              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.2] mb-6 text-foreground">
                <span className="text-primary">مسارك</span>
                <br />
                بوابتك للتفوق
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-lg font-medium">
                كل ما يحتاجه طالب الثانوية العامة في مكان واحد.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link href="/register/student">
                  <Button size="lg" className="rounded-2xl px-12 font-bold h-14 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    ابدأ رحلتك مجاناً
                  </Button>
                </Link>
              </div>
            </div>

            {/* Left: Image (Since RTL) */}
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FEATURED COURSES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-muted/30 border-y border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                badge="الكورسات"
                title="كورسات مميزة"
                subtitle="أفضل الكورسات اللي هتساعدك تقفل المادة"
                align="left"
                className="mb-0 max-w-lg"
              />
              <Link href="/courses" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 pb-1">
                عرض الكل <ArrowLeft className="w-4 h-4 flip-rtl" />
              </Link>
            </div>
            <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCourses.map(course => {
                const teacher = teachers.find(t => t.id === course.teacherId);
                return (
                  <CourseCard 
                    key={course.id}
                    id={course.id.toString()}
                    title={course.title}
                    teacher={teacher?.name || ''}
                    teacherAvatar={teacher?.avatar}
                    thumbnail={course.thumbnail}
                    subject={categories.find(c => c.id === course.categoryId)?.name || ''}
                    totalLessons={course.lessonsCount}
                    rating={course.rating}
                    studentsCount={course.studentsCount}
                    price={parseFloat(course.price.toString())}
                    originalPrice={course.originalPrice ? parseFloat(course.originalPrice.toString()) : undefined}
                  />
                );
              })}
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. POPULAR TEACHERS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
            {featuredTeachers.map(teacher => (
              <TeacherCard 
                key={teacher.id} 
                id={teacher.id.toString()}
                name={teacher.name}
                subject={teacher.specialization}
                avatar={teacher.avatar}
                bio={teacher.bio}
                studentsCount={teacher.studentsCount}
                coursesCount={teacher.coursesCount}
              />
            ))}
          </AnimatedDiv>
        </Section>
      </AppContainer>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. SUBJECTS (Categories)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-muted/30 border-y border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                badge="المواد الدراسية"
                title="تصفح بالمواد الدراسية"
                subtitle="اختر المادة اللي محتاج تذاكرها وابدأ فوراً"
                align="left"
                className="mb-0 max-w-lg"
              />
              <Link href="/courses" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 pb-1">
                عرض الكل <ArrowLeft className="w-4 h-4 flip-rtl" />
              </Link>
            </div>
            <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {featuredCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. LATEST COURSES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
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
            {latestCourses.map(course => {
              const teacher = teachers.find(t => t.id === course.teacherId);
              return (
                <CourseCard 
                  key={course.id}
                  id={course.id.toString()}
                  title={course.title}
                  teacher={teacher?.name || ''}
                  teacherAvatar={teacher?.avatar}
                  thumbnail={course.thumbnail}
                  subject={categories.find(c => c.id === course.categoryId)?.name || ''}
                  totalLessons={course.lessonsCount}
                  rating={course.rating}
                  studentsCount={course.studentsCount}
                  price={parseFloat(course.price.toString())}
                  originalPrice={course.originalPrice ? parseFloat(course.originalPrice.toString()) : undefined}
                />
              );
            })}
          </AnimatedDiv>
        </Section>
      </AppContainer>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. REVISION COURSES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-muted/30 border-y border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                badge="المراجعات"
                title="كورسات المراجعة النهائية"
                subtitle="لم المنهج كله في وقت قياسي قبل الامتحان"
                align="left"
                className="mb-0 max-w-lg"
              />
              <Link href="/courses" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 pb-1">
                عرض الكل <ArrowLeft className="w-4 h-4 flip-rtl" />
              </Link>
            </div>
            <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {revisionCourses.map(course => {
                const teacher = teachers.find(t => t.id === course.teacherId);
                return (
                  <CourseCard 
                    key={course.id}
                    id={course.id.toString()}
                    title={course.title}
                    teacher={teacher?.name || ''}
                    teacherAvatar={teacher?.avatar}
                    thumbnail={course.thumbnail}
                    subject={categories.find(c => c.id === course.categoryId)?.name || ''}
                    totalLessons={course.lessonsCount}
                    rating={course.rating}
                    studentsCount={course.studentsCount}
                    price={parseFloat(course.price.toString())}
                    originalPrice={course.originalPrice ? parseFloat(course.originalPrice.toString()) : undefined}
                  />
                );
              })}
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. STUDENT REVIEWS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="py-20 md:py-24">
          <SectionHeader
            badge="الآراء"
            title="آراء الطلاب"
            subtitle="شوف زمايلك بيقولوا إيه عن تجربتهم في مسارك"
          />
          <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.slice(0, 3).map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </AnimatedDiv>
        </Section>
      </AppContainer>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          8. FAQ
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-muted/30 border-t border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <SectionHeader
              badge="الأسئلة الشائعة"
              title="عندك استفسار؟"
              subtitle="إجابات واضحة لأكتر الأسئلة اللي بتهمك كطالب"
            />
            <AnimatedDiv variant="fadeUp" className="max-w-2xl mx-auto">
              <FAQAccordion items={faqs.slice(0, 5)} />
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          9. CTA SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="pb-20 md:pb-24 pt-10">
          <AnimatedDiv variant="fadeUp">
            <CTASection 
              title="جاهز تبدأ تذاكر صح؟"
              description="انضم لأكتر من 50,000 طالب ثانوية عامة بيعتمدوا على مسارك في مذاكرتهم."
              primaryAction={{ label: "اعمل حساب مجاني", href: "/register/student" }}
            />
          </AnimatedDiv>
        </Section>
      </AppContainer>

    </div>
  );
}
