import { AppContainer, Section } from "@/shared/layouts/Containers";
import { Button } from "@/shared/components/atoms/Button";
import { AnimatedDiv } from "@/shared/components/atoms/Motion";
import { CheckCircle, DollarSign, Video, Globe, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function BecomeTeacherPage() {
  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 pt-20 pb-24 md:pt-32 md:pb-32 border-b border-border">
        <AppContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start gap-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm">
                <GraduationCap className="w-5 h-5" />
                انضم لنخبة المعلمين
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                شارك معرفتك،<br />
                <span className="text-primary">وغيّر حياة الآلاف.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                انضم إلى منصة مسارك اليوم واصنع محتوى تعليمي يصل لملايين الطلاب في جميع أنحاء الوطن العربي مع تحقيق دخل مستدام.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                <Button size="lg" className="h-14 px-8 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  قدم طلبك الآن
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full font-bold text-lg bg-background">
                  كيف يعمل البرنامج؟
                </Button>
              </div>
            </div>
            
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute inset-4 bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden flex items-center justify-center">
                <div className="w-full h-full relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80" 
                    alt="Teacher recording course" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">جاري التسجيل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppContainer>
      </section>

      {/* Benefits Section */}
      <AppContainer>
        <Section className="py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تُدرّس مع مسارك؟</h2>
            <p className="text-muted-foreground text-lg">نوفر لك كل الأدوات والدعم الذي تحتاجه للنجاح كمعلم إلكتروني.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'حقق دخلاً مستداماً',
                desc: 'اكسب المال مقابل كل طالب يسجل في دورتك. نحن نضمن لك نسبة أرباح هي الأفضل في السوق.'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'انتشار واسع',
                desc: 'تصل دوراتك لطلاب من كافة أنحاء العالم العربي دون أن تحمل هم التسويق والإعلانات.'
              },
              {
                icon: <Video className="w-8 h-8" />,
                title: 'أدوات احترافية',
                desc: 'نوفر لك استوديوهات ومعدات تصوير، بالإضافة لفريق مونتاج متكامل ليظهر المحتوى بأفضل جودة.'
              }
            ].map((benefit, idx) => (
              <AnimatedDiv key={idx} variant="fadeUp" className="bg-card border border-border/50 p-8 rounded-3xl hover:border-primary/50 transition-colors shadow-sm group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </AnimatedDiv>
            ))}
          </div>
        </Section>
      </AppContainer>

      {/* How it works */}
      <section className="bg-muted/30 border-y border-border py-24">
        <AppContainer>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">كيف تبدأ رحلتك؟</h2>
            <p className="text-muted-foreground text-lg">خطوات بسيطة تفصلك عن إطلاق دورتك الأولى.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-border/80" />
            
            {[
              { step: '1', title: 'قدّم طلبك', desc: 'املأ استمارة التقديم وشاركنا خبراتك ومجال تخصصك.' },
              { step: '2', title: 'صمم دورتك', desc: 'ساعدنا في بناء المنهج التعليمي وتحديد أهداف الدورة.' },
              { step: '3', title: 'سجل المحتوى', desc: 'استخدم أدواتنا أو استوديوهاتنا لتسجيل فيديوهات عالية الجودة.' },
              { step: '4', title: 'اطلق واربح', desc: 'سنقوم بنشر الدورة وتسويقها، لتبدأ في تحقيق أرباحك.' },
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center text-xl font-black text-primary relative z-10 mb-6 shadow-sm">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </AppContainer>
      </section>

      {/* Testimonial & Requirements */}
      <AppContainer>
        <Section className="py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">ماذا يقول المعلمون عن مسارك؟</h2>
              <div className="bg-card border border-border/60 p-8 rounded-3xl shadow-sm relative">
                <span className="text-6xl text-primary/20 absolute top-4 right-6 font-serif">&quot;</span>
                <p className="text-lg leading-relaxed text-foreground/90 mb-8 relative z-10">
                  منذ انضمامي لمسارك، تضاعف دخلي وتمكنت من الوصول لآلاف الطلاب الشغوفين بالبرمجة. الدعم الفني والتسويقي الذي توفره المنصة لا يعلى عليه.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-muted overflow-hidden">
                    <Image src="https://i.pravatar.cc/150?img=11" alt="Teacher" width={56} height={56} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">م. أسامة محمود</h4>
                    <p className="text-sm text-muted-foreground">خبير تطوير ويب - أكثر من 15,000 طالب</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 p-8 md:p-12 rounded-[2rem]">
              <h3 className="text-2xl font-bold mb-6">متطلبات الانضمام</h3>
              <ul className="space-y-4">
                {[
                  'خبرة عملية لا تقل عن سنتين في مجال تخصصك',
                  'شغف بالتدريس وقدرة على تبسيط المعلومات',
                  'جودة صوت وصورة ممتازة في حال التسجيل المنزلي',
                  'الالتزام بالرد على أسئلة الطلاب في المنتدى',
                ].map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-foreground/80">
                    <CheckCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-lg leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-10 h-14 rounded-xl font-bold text-lg">
                بدء التسجيل الآن
              </Button>
            </div>
          </div>
        </Section>
      </AppContainer>

    </div>
  );
}
