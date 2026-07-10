'use client';

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import {
  BookOpen, Search, ChevronLeft, ChevronRight,
  Clock, Users, PlayCircle,
} from 'lucide-react';

interface Enrollment {
  enrollmentId: string;
  enrolledAt: string;
  course: {
    id: string; title: string; slug: string; thumbnailUrl?: string;
    price: number; grade?: string; teacherName?: string; teacherAvatar?: string; sectionsCount: number;
  };
  progress: { completionPct: number; lastAccessedAt?: string; completedAt?: string };
}

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const take = 12;

  const fetchCourses = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/student/courses?take=${take}&skip=${page * take}`);
      const all = data.data || [];
      setEnrollments(search ? all.filter((e: Enrollment) => e.course.title.includes(search)) : all);
      setTotal(data.total || 0);
    } catch {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  React.useEffect(() => { fetchCourses(); }, [fetchCourses]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />كورساتي
          </h1>
          <p className="text-sm text-text-muted mt-1">{total} كورس مسجل</p>
        </div>
        <Link href="/courses" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
          تصفح المزيد
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="البحث في كورساتي..."
          className="w-full ps-9 pe-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:border-primary outline-none" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-2 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border/60 rounded-2xl">
          <BookOpen className="w-16 h-16 text-text-muted mb-4" />
          <p className="text-lg font-bold text-foreground">لم تسجل في أي كورس</p>
          <Link href="/courses" className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
            تصفح الكورسات
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((item) => (
              <Link key={item.enrollmentId} href={`/dashboard/student/course/${item.course.slug || item.course.id}`}
                className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {item.course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.course.thumbnailUrl} alt={item.course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-text-muted" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  {/* Progress overlay */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20">
                    <div className="h-full bg-primary transition-all" style={{ width: `${item.progress.completionPct}%` }} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">{item.course.title}</h3>
                  {item.course.teacherName && (
                    <p className="text-xs text-text-muted mb-3">{item.course.teacherName}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {item.course.sectionsCount} أقسام</span>
                    {item.progress.lastAccessedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.progress.lastAccessedAt).toLocaleDateString('ar-EG')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.progress.completionPct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-text-muted">{Math.round(item.progress.completionPct)}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold">{page + 1}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * take >= total}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
