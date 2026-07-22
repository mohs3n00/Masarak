'use client';

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import {
  BookOpen, Plus, Search, Filter,
  Users, Edit, Send, ChevronLeft, ChevronRight, Eye,
} from 'lucide-react';

interface Course {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl?: string;
  price: number;
  status: string;
  grade?: string;
  category?: string;
  enrollmentCount: number;
  sectionCount: number;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'مسودة', UNDER_REVIEW: 'تحت المراجعة', PUBLISHED: 'منشور', ARCHIVED: 'مؤرشف',
};
const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-muted text-text-muted',
  UNDER_REVIEW: 'bg-warning/10 text-warning',
  PUBLISHED: 'bg-success/10 text-success',
  ARCHIVED: 'bg-error/10 text-error',
};

export default function TeacherCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [submitting, setSubmitting] = React.useState<string | null>(null);
  const take = 12;

  const fetchCourses = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ take: String(take), skip: String(page * take), ...(statusFilter && { status: statusFilter }) });
      const { data } = await apiClient.get(`/teacher/courses?${params}`);
      const all: Course[] = data.data || [];
      const filtered = search
        ? all.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
        : all;
      setCourses(filtered);
      setTotal(data.total || 0);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  React.useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSubmitForReview = async (courseId: string) => {
    setSubmitting(courseId);
    try {
      await apiClient.post(`/teacher/courses/${courseId}/submit`);
      fetchCourses();
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'فشل نشر الكورس. تأكد من إضافة دروس أولاً.');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            كورساتي
          </h1>
          <p className="text-sm text-text-muted mt-1">{total} كورس</p>
        </div>
        <Link
          href="/dashboard/teacher/courses/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          كورس جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث في الكورسات..."
            className="w-full ps-9 pe-4 py-2.5 text-sm bg-muted rounded-xl border border-transparent focus:border-border focus:bg-background outline-none"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-text-muted shrink-0" />
          {['', 'DRAFT', 'PUBLISHED'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={cn('px-3 py-2 rounded-xl text-xs font-bold transition-all',
                statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-muted hover:bg-muted/80'
              )}
            >
              {s === '' ? 'الكل' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border/60 rounded-2xl">
          <BookOpen className="w-16 h-16 text-text-muted mb-4" />
          <p className="text-lg font-bold text-foreground">لا توجد كورسات</p>
          <p className="text-sm text-text-muted mt-1 mb-6">ابدأ بإنشاء أول كورس لك الآن</p>
          <Link href="/dashboard/teacher/courses/create" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
            <Plus className="w-4 h-4" /> إنشاء كورس
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div key={course.id} className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group flex flex-col">
                <Link href={`/player/${course.slug}?courseId=${course.id}`} className="flex flex-col flex-1">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {course.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-text-muted" />
                      </div>
                    )}
                    <div className="absolute top-2 start-2">
                      <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm', STATUS_COLORS[course.status])}>
                        {STATUS_LABELS[course.status]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-4">
                      {course.grade && <span>{course.grade}</span>}
                      {course.category && <span>{course.category}</span>}
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {course.enrollmentCount}
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Actions */}
                <div className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link
                      href={`/dashboard/teacher/courses/${course.id}/edit`}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> تعديل
                    </Link>
                    <Link
                      href={`/dashboard/teacher/courses/${course.id}/lessons`}
                      className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-indigo-500/10 text-indigo-500 text-xs font-bold hover:bg-indigo-500 hover:text-white transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> محتوى الكورس
                    </Link>
                    
                    <button
                      onClick={() => course.status === 'DRAFT' && handleSubmitForReview(course.id)}
                      disabled={submitting === course.id || course.status !== 'DRAFT'}
                      className={cn(
                        "col-span-2 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-colors",
                        course.status === 'DRAFT' 
                          ? "bg-warning/10 text-warning hover:bg-warning hover:text-white" 
                          : "bg-muted/50 text-text-muted opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-3.5 h-3.5" /> {course.status === 'DRAFT' ? 'نشر الكورس' : 'تم النشر'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-foreground px-3">{page + 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * take >= total}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
