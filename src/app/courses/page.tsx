import { AppContainer, Section } from "@/shared/layouts/Containers";
import { CoursePreviewCard } from '@/features/marketing/components/cards/CourseCard';
import { CourseSearchBar } from "@/features/marketing/components/filters/CourseSearchBar";
import { CourseSidebarFilters } from "@/features/marketing/components/filters/CourseSidebarFilters";
import { CourseSortSelect } from "@/features/marketing/components/filters/CourseSortSelect";
import { AppPagination } from "@/shared/components/molecules/AppPagination";
import { fetchPublicCourses, fetchPublicSubjects } from "@/lib/api/public";
import { cookies } from "next/headers";
import { CourseListContainer } from '@/features/marketing/components/CourseListContainer';

const ITEMS_PER_PAGE = 9;

// We define levels statically since they correspond to the standard grades
const mockLevels = [
  { id: '1', name: 'الصف الأول الثانوي', slug: 'الصف الأول الثانوي' },
  { id: '2', name: 'الصف الثاني الثانوي', slug: 'الصف الثاني الثانوي' },
  { id: '3', name: 'الصف الثالث الثانوي', slug: 'الصف الثالث الثانوي' },
];

export default async function CoursesPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value || cookieStore.get('access_token')?.value;
  
  const subjectSlug = typeof searchParams.subject === 'string' ? searchParams.subject : (typeof searchParams.category === 'string' ? searchParams.category : undefined);
  const query = typeof searchParams.q === 'string' ? searchParams.q.toLowerCase() : undefined;
  const levels = Array.isArray(searchParams.level) ? searchParams.level : (typeof searchParams.level === 'string' ? [searchParams.level] : []);
  const gradeSlug = levels.length > 0 ? levels[0] : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;
  const page = typeof searchParams.page === 'string' ? Math.max(1, parseInt(searchParams.page) || 1) : 1;

  // Fetch real data
  const [{ data: courses, total: totalItems }, subjects] = await Promise.all([
    fetchPublicCourses({
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
      q: query,
      subject: subjectSlug,
      grade: gradeSlug,
      sort: sort,
      token: token,
    }),
    fetchPublicSubjects()
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

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
            <CourseSidebarFilters categories={subjects} totalCourses={totalItems} levels={token ? mockLevels : []} />

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <CourseListContainer initialCourses={courses || []} />
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