'use client';

import React from 'react';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import {
  BookOpen, Search, Filter,
  Ban, ChevronLeft, ChevronRight
} from 'lucide-react';


interface Course {
  id: string;
  title: string;
  status: string;
  thumbnailUrl?: string;
  teacherName?: string;
  createdAt: string;
  enrollmentCount: number;
  averageRating?: number;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'مسودة',
  UNDER_REVIEW: 'تحت المراجعة',
  PUBLISHED: 'منشور',
  ARCHIVED: 'مؤرشف',
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-muted text-text-muted',
  UNDER_REVIEW: 'bg-warning/10 text-warning',
  PUBLISHED: 'bg-success/10 text-success',
  ARCHIVED: 'bg-error/10 text-error',
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const take = 20;

  const fetchCourses = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ take: String(take), skip: String(page * take) });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const { data } = await apiClient.get(`/admin/courses?${params}`);
      setCourses(data.data || []);
      setTotal(data.total || 0);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const toggleCourseStatus = async (id: string, currentStatus: string) => {
    setActionLoading(id);
    try {
      const endpoint = currentStatus === 'PUBLISHED' ? `/admin/courses/${id}/unpublish` : `/admin/courses/${id}/publish`;
      await apiClient.post(endpoint);
      fetchCourses();
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            إدارة الكورسات
          </h1>
          <p className="text-sm text-text-muted mt-1">إجمالي الكورسات: {total}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="البحث في الكورسات..."
              className="w-full ps-9 pe-4 py-2.5 text-sm bg-card border border-border/60 rounded-xl focus:border-primary outline-none"
            />
          </div>
          <div className="relative shrink-0">
            <Filter className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="appearance-none ps-9 pe-8 py-2.5 text-sm bg-card border border-border/60 rounded-xl focus:border-primary outline-none cursor-pointer min-w-32"
            >
              <option value="">كل الحالات</option>
              <option value="DRAFT">مسودة</option>
              <option value="UNDER_REVIEW">تحت المراجعة</option>
              <option value="PUBLISHED">منشور</option>
              <option value="ARCHIVED">مؤرشف</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted/50 border-b border-border/60 text-text-muted font-bold">
              <tr>
                <th className="px-6 py-4 text-start font-bold">الكورس</th>
                <th className="px-6 py-4 text-start font-bold">المدرس</th>
                <th className="px-6 py-4 text-center font-bold">الطلاب</th>
                <th className="px-6 py-4 text-center font-bold">التقييم</th>
                <th className="px-6 py-4 text-center font-bold">تاريخ الإنشاء</th>
                <th className="px-6 py-4 text-center font-bold">الحالة</th>
                <th className="px-6 py-4 text-end font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 flex gap-3">
                      <div className="w-12 h-8 rounded bg-muted" />
                      <div className="h-5 w-32 bg-muted rounded" />
                    </td>
                    <td className="px-6 py-4"><div className="h-5 w-24 bg-muted rounded" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-5 w-8 bg-muted rounded mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-5 w-8 bg-muted rounded mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-24 bg-muted rounded mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-6 w-20 bg-muted rounded-full mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-16 bg-muted rounded-lg ms-auto" /></td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    لا توجد كورسات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {course.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={course.thumbnailUrl} alt={course.title} className="w-12 h-8 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-8 rounded bg-primary/10 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <p className="font-bold text-foreground max-w-xs truncate" title={course.title}>
                          {course.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{course.teacherName || '—'}</td>
                    <td className="px-6 py-4 text-center font-bold">{course.enrollmentCount}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-500">
                      ⭐ {(course.averageRating || 0).toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-text-muted">
                      {new Date(course.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold',
                        STATUS_COLORS[course.status] || STATUS_COLORS.DRAFT
                      )}>
                        {STATUS_LABELS[course.status] || course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">

                        {course.status === 'UNDER_REVIEW' && (
                          <button
                            onClick={() => toggleCourseStatus(course.id, 'DRAFT')}
                            disabled={actionLoading === course.id}
                            className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-success text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                          >
                            موافقة ونشر
                          </button>
                        )}
                        {course.status === 'PUBLISHED' && (
                          <button
                            onClick={() => toggleCourseStatus(course.id, course.status)}
                            disabled={actionLoading === course.id}
                            className="text-[10px] font-bold px-2 py-1.5 rounded-lg border border-border text-text-muted hover:text-warning hover:border-warning hover:bg-warning/5 disabled:opacity-50 transition-colors flex items-center gap-1"
                          >
                            <Ban className="w-3 h-3" />
                            إلغاء النشر
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!confirm('هل أنت متأكد من حذف هذا الكورس نهائياً؟')) return;
                            setActionLoading(course.id);
                            try {
                              await apiClient.delete(`/admin/courses/${course.id}`);
                              fetchCourses();
                            } finally {
                              setActionLoading(null);
                            }
                          }}
                          disabled={actionLoading === course.id}
                          className="p-1.5 rounded-lg border border-border text-text-muted hover:text-error hover:border-error hover:bg-error/5 disabled:opacity-50 transition-colors"
                          title="حذف الكورس"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && total > take && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-foreground px-3">{page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * take >= total}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
