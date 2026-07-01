import { AppContainer, Section } from "@/shared/layouts/Containers";
import { TeacherPreviewCard } from "@/features/marketing/components/cards/TeacherPreviewCard";
import { teachers } from "@/mock";
import { Search, GraduationCap } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";

export default function TeachersPage() {
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
            <div className="w-full max-w-xl mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن معلم بالاسم أو التخصص..."
                  className="w-full bg-background border border-border/60 rounded-xl h-14 ps-11 pe-32 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                />
                <div className="absolute inset-y-1 end-1">
                  <Button className="h-full rounded-lg px-6 font-bold">بحث</Button>
                </div>
              </div>
            </div>
          </div>
        </AppContainer>
      </div>

      <AppContainer>
        <Section className="pt-12">
          {/* Subjects Filter */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              الكل
            </button>
            {['برمجة', 'تصميم', 'لغات', 'تسويق', 'رياضيات', 'فيزياء'].map((subject, idx) => (
              <button key={idx} className="px-5 py-2 rounded-full bg-muted/50 text-foreground font-medium text-sm hover:bg-muted transition-colors">
                {subject}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <TeacherPreviewCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

        </Section>
      </AppContainer>
    </div>
  );
}