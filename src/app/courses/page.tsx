import { AppContainer, Section } from "@/shared/layouts/Containers";
import { CoursePreviewCard } from "@/features/marketing/components/cards/CoursePreviewCard";
import { courses, categories } from "@/mock";
import { Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";

export default function CoursesPage() {
  return (
    <div className="w-full bg-background min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-card border-b border-border">
        <AppContainer>
          <div className="py-8 md:py-12 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                تصفح الدورات التدريبية
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                اكتشف مئات الدورات في البرمجة، التصميم، التسويق، وغيرها من المجالات المطلوبة في سوق العمل.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن دورة، مهارة، أو موضوع..."
                  className="w-full bg-background border border-border/60 rounded-xl h-12 ps-11 pe-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                />
              </div>
              <Button variant="outline" className="h-12 px-6 rounded-xl gap-2 font-bold shrink-0">
                <Filter className="h-5 w-5" />
                فلترة النتائج
              </Button>
            </div>
          </div>
        </AppContainer>
      </div>

      <AppContainer>
        <Section className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar / Categories */}
            <aside className="hidden lg:block space-y-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-foreground">التصنيفات</h3>
                <div className="flex flex-col gap-1.5">
                  <button className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-bold text-sm transition-colors text-start">
                    الكل
                    <span className="bg-background/60 px-2 py-0.5 rounded-md text-xs">{courses.length}</span>
                  </button>
                  {categories.slice(0, 8).map((cat, idx) => (
                    <button key={idx} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-sm transition-colors text-start group">
                      {cat.name}
                      <span className="bg-muted px-2 py-0.5 rounded-md text-xs text-muted-foreground group-hover:bg-background transition-colors">
                        {(idx * 7) % 20 + 5}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-foreground">مستوى الدورة</h3>
                <div className="flex flex-col gap-3">
                  {['مبتدئ', 'متوسط', 'متقدم', 'جميع المستويات'].map((level, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                        {/* Checkbox placeholder */}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Toolbar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <p className="text-sm font-medium text-muted-foreground">
                  عرض <span className="text-foreground font-bold">{courses.length}</span> دورة تدريبية
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">ترتيب حسب:</span>
                  <select className="bg-transparent font-bold text-foreground focus:outline-none cursor-pointer">
                    <option>الأكثر صلة</option>
                    <option>الأحدث</option>
                    <option>الأعلى تقييماً</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CoursePreviewCard key={course.id} course={course} />
                ))}
              </div>

              {/* Pagination Placeholder */}
              <div className="flex items-center justify-center pt-8">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg text-muted-foreground" disabled>
                    <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                  </Button>
                  <Button variant="default" className="w-10 h-10 rounded-lg p-0 font-bold">1</Button>
                  <Button variant="ghost" className="w-10 h-10 rounded-lg p-0 font-bold text-muted-foreground">2</Button>
                  <Button variant="ghost" className="w-10 h-10 rounded-lg p-0 font-bold text-muted-foreground">3</Button>
                  <span className="text-muted-foreground px-2">...</span>
                  <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg text-muted-foreground">
                    <ChevronRight className="h-5 w-5 ltr:rotate-180" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </Section>
      </AppContainer>
    </div>
  );
}