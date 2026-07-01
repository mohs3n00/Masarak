import { Metadata } from 'next';
import Link from 'next/link';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Button } from '@/shared/components/atoms/Button';
import { FAQAccordion } from '@/features/marketing/components/blocks/FAQAccordion';
import { SectionHeader } from '@/features/marketing/components/blocks/SectionHeader';
import { CategoryCard } from '@/features/marketing/components/cards/CategoryCard';
import { CoursePreviewCard } from '@/features/marketing/components/cards/CoursePreviewCard';
import { FeatureCard } from '@/features/marketing/components/cards/FeatureCard';
import { TeacherPreviewCard } from '@/features/marketing/components/cards/TeacherPreviewCard';
import { TestimonialCard } from '@/features/marketing/components/cards/TestimonialCard';
import { HeroBackground } from '@/features/marketing/components/hero/HeroBackground';
import { HeroImage } from '@/features/marketing/components/hero/HeroImage';
import homeStartImage from '@/assets/images/home start.png';

import { courses, teachers, categories, features, faqs, statistics, testimonials } from '@/mock';
import { BookOpen, GraduationCap, Star, Users, ArrowLeft, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'مسارك | منصة التعليم الذكية',
  description: 'منصة مسارك التعليمية الرائدة للتعليم عن بعد. انضم لآلاف الطلاب والمعلمين الآن.',
};

const trustBadges = [
  'شهادات معتمدة',
  '+500 كورس',
  'دعم 24/7',
  'تعلم بأي وقت',
];

export default function LandingPage() {
  const featuredCourses = courses.slice(0, 4);
  const featuredTeachers = teachers.slice(0, 4);
  const featuredCategories = categories.slice(0, 8);

  return (
    <div className="relative overflow-hidden w-full">
      <HeroBackground />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="pt-24 md:pt-32 pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Copy */}
            <div className="flex flex-col items-start text-start">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                أحدث تجربة تعليم رقمي عربي
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.2] mb-5 text-foreground">
                تعلّم المهارات التي{' '}
                <span className="text-primary">يطلبها السوق</span>{' '}
                من أفضل الخبراء
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                منصة تعليمية عربية تجمع بين المحتوى الاحترافي والتجربة التفاعلية. 
                اختر مسارك وابدأ رحلتك اليوم.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link href="/courses">
                  <Button size="lg" className="rounded-full px-8 font-semibold h-12 text-[15px] shadow-sm hover:shadow-md transition-shadow">
                    استكشف الكورسات
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 font-semibold h-12 text-[15px] border-border/60 hover:border-border hover:bg-muted/40"
                  >
                    ابدأ مجاناً
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {trustBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image + Floating Stats */}
            <div className="relative hidden lg:flex justify-end items-center">
              <div className="relative w-[95%] aspect-[4/3] max-w-[560px]">
                <HeroImage
                  src={homeStartImage}
                  alt="منصة مسارك"
                  className="rounded-3xl object-cover shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border-border/40"
                />
                
                {/* Floating Card: Stats */}
                <div className="absolute -bottom-4 -start-8 bg-card border border-border/60 rounded-2xl p-4 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">4.9</p>
                    <p className="text-xs text-muted-foreground mt-0.5">تقييم الطلاب</p>
                  </div>
                </div>

                {/* Floating Card: Students */}
                <div className="absolute -top-4 -end-6 bg-card border border-border/60 rounded-2xl p-4 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">+50K</p>
                    <p className="text-xs text-muted-foreground mt-0.5">طالب نشط</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </AppContainer>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. STATS STRIP
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="border-y border-border/50 bg-muted/30">
        <AppContainer>
          <div className="py-8">
            <AnimatedDiv variant="staggerContainer" className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50">
              {[
                { value: statistics.totalStudents.toLocaleString('ar-SA'), label: 'طالب مسجل', icon: Users },
                { value: statistics.totalTeachers.toLocaleString('ar-SA'), label: 'معلم خبير', icon: GraduationCap },
                { value: statistics.totalCourses.toLocaleString('ar-SA'), label: 'كورس متاح', icon: BookOpen },
                { value: statistics.totalHoursWatched.toLocaleString('ar-SA'), label: 'ساعة تعليمية', icon: Star },
              ].map(({ value, label, icon: Icon }) => (
                <AnimatedDiv key={label} variant="fadeUp" className="flex flex-col items-center justify-center py-6 bg-background gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-primary">{value}</span>
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                </AnimatedDiv>
              ))}
            </AnimatedDiv>
          </div>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. CATEGORIES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="py-20 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader
              badge="التصنيفات"
              title="تصفح مجالات التعلم"
              subtitle="اختر مجالك واحصل على المسار المثالي لك"
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. FEATURED COURSES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-muted/30 border-y border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                badge="الكورسات"
                title="أكثر الكورسات طلباً"
                subtitle="منتقاة بعناية من قِبَل فريق المحتوى"
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
                return <CoursePreviewCard key={course.id} course={course} teacher={teacher} />;
              })}
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. PLATFORM FEATURES
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="py-20 md:py-24">
          <SectionHeader
            badge="لماذا مسارك؟"
            title="تجربة تعليمية مختلفة"
            subtitle="أدوات وميزات مصممة لتمنحك أفضل رحلة تعلم ممكنة"
          />
          <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(feature => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                iconName={
                  feature.icon === 'video' ? 'PlayCircle'
                  : feature.icon === 'users' ? 'Users'
                  : feature.icon === 'check-circle' ? 'CheckCircle'
                  : 'Headphones'
                }
              />
            ))}
          </AnimatedDiv>
        </Section>
      </AppContainer>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          6. TEACHERS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-muted/30 border-y border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <SectionHeader
                badge="المعلمون"
                title="تعلّم من الخبراء"
                subtitle="نخبة من المتخصصين المعتمدين في مختلف المجالات"
                align="left"
                className="mb-0 max-w-lg"
              />
              <Link href="/teachers" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 pb-1">
                عرض الكل <ArrowLeft className="w-4 h-4 flip-rtl" />
              </Link>
            </div>
            <AnimatedDiv variant="staggerContainer" className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredTeachers.map(teacher => (
                <TeacherPreviewCard key={teacher.id} teacher={teacher} />
              ))}
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          7. TESTIMONIALS
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="py-20 md:py-24">
          <SectionHeader
            badge="الآراء"
            title="ماذا يقول طلابنا؟"
            subtitle="تجارب حقيقية من طلاب غيّروا مسارهم معنا"
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
      <div className="bg-muted/30 border-y border-border/50">
        <AppContainer>
          <Section className="py-20 md:py-24">
            <SectionHeader
              badge="الأسئلة الشائعة"
              title="هل لديك استفسار؟"
              subtitle="إجابات واضحة لأكثر الأسئلة شيوعاً"
            />
            <AnimatedDiv variant="fadeUp" className="max-w-2xl mx-auto">
              <FAQAccordion items={faqs.slice(0, 5)} />
            </AnimatedDiv>
          </Section>
        </AppContainer>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          9. CTA BANNER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AppContainer>
        <Section className="py-20 md:py-28">
          <AnimatedDiv variant="fadeUp">
            <div className="relative rounded-3xl overflow-hidden bg-foreground text-background p-10 md:p-16 text-center">
              {/* Decorative element */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,110,0.12)_0%,transparent_60%)] pointer-events-none" />
              
              <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  ابدأ الآن مجاناً
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  جاهز لتبدأ رحلتك التعليمية؟
                </h2>
                <p className="text-background/70 leading-relaxed">
                  انضم إلى أكثر من 50,000 طالب يثقون في مسارك لبناء مهاراتهم ومستقبلهم.
                </p>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="rounded-full px-10 font-semibold h-12 text-[15px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-none"
                  >
                    إنشاء حساب مجاني
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedDiv>
        </Section>
      </AppContainer>
    </div>
  );
}
