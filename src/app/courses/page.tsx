import { AppContainer, Section } from "@/shared/layouts/Containers";
import { CoursePreviewCard } from "@/features/marketing/components/cards/CoursePreviewCard";
import { courses, categories } from "@/mock";

import { CourseSearchBar } from "@/features/marketing/components/filters/CourseSearchBar";
import { CourseSidebarFilters } from "@/features/marketing/components/filters/CourseSidebarFilters";
import { levels as mockLevels } from "@/mock";
import { CourseSortSelect } from "@/features/marketing/components/filters/CourseSortSelect";
import { AppPagination } from "@/shared/components/molecules/AppPagination";

const ITEMS_PER_PAGE = 9;

export default async function CoursesPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  
  const categorySlug = typeof searchParams.category === 'string' ? searchParams.category : null;
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : '';
  const levels = Array.isArray(searchParams.level) ? searchParams.level : (typeof searchParams.level === 'string' ? [searchParams.level] : []);
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'relevant';
  const page = typeof searchParams.page === 'string' ? Math.max(1, parseInt(searchParams.page) || 1) : 1;

  // 1. Filter
  let filteredCourses = courses.filter((course) => {
    // Category match
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug);
      if (!cat || course.categoryId !== cat.id) return false;
    }
    
    // Search match
    if (query) {
      if (!course.title.toLowerCase().includes(query)) return false;
    }

    // Level match
    if (levels.length > 0) {
      const courseLevel = mockLevels.find(l => l.id === course.levelId);
      if (!courseLevel || !levels.includes(courseLevel.slug)) return false;
    }

    return true;
  });

  // 2. Sort
  if (sort === 'newest') {
    filteredCourses.sort((a, b) => String(b.id).localeCompare(String(a.id)));
  } else if (sort === 'rating') {
    filteredCourses.sort((a, b) => b.rating - a.rating);
  }

  // 3. Paginate
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
            <CourseSearchBar />
          </div>
        </AppContainer>
      </div>

      <AppContainer>
        <Section className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar / Categories */}
            <CourseSidebarFilters categories={categories} courses={courses} levels={mockLevels} />

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Toolbar */}
              <CourseSortSelect count={totalItems} />

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((course) => (
                    <CoursePreviewCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    لا توجد دورات تطابق معايير البحث
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <AppPagination totalPages={totalPages} />
              )}
            </div>
          </div>
        </Section>
      </AppContainer>
    </div>
  );
}