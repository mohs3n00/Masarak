'use client';

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { cn } from '@/lib/utils';
import {
  BookOpen, Users, Star, Wallet, TrendingUp,
  Plus, ArrowLeft, BarChart2, Eye,
} from 'lucide-react';

interface TeacherStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  averageRating: number;
  totalReviews: number;
  walletBalance: number;
  totalEarned: number;
  invitationCode: string;
  verificationStatus: string;
}

interface RecentCourse {
  id: string;
  title: string;
  thumbnailUrl?: string;
  status: string;
  enrollmentCount: number;
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

export default function TeacherDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = React.useState<TeacherStats | null>(null);
  const [courses, setCourses] = React.useState<RecentCourse[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          apiClient.get('/teacher/dashboard'),
          apiClient.get('/teacher/courses?take=5'),
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data?.data || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مساء الخير';
    return 'مساء النور';
  })();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 md:p-10 shadow-sm group">
        {/* Decorative Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5 opacity-50" />
        <div className="absolute -top-40 -end-40 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -start-40 w-[500px] h-[500px] bg-success/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold mb-2 text-foreground tracking-tight flex items-center gap-2">
              {greeting}، أستاذ {user?.name || 'مدرس'}
              <span className="animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-muted-foreground text-[15px] max-w-xl leading-relaxed">
              يسعدنا تواجدك معنا. إليك ملخص سريع لأداء كورساتك وتفاعلات طلابك لهذا الأسبوع.
            </p>

            {stats?.verificationStatus === 'PENDING' && (
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-warning/10 text-warning-foreground border border-warning/20 rounded-xl text-sm font-semibold">
                ⚠️ حسابك قيد المراجعة. لن تتمكن من نشر الكورسات حتى يتم الاعتماد.
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {stats?.verificationStatus === 'APPROVED' ? (
              <Link
                href="/dashboard/teacher/courses/create"
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                إنشاء كورس
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-xl text-sm font-bold cursor-not-allowed border border-border/50"
              >
                <Plus className="w-4 h-4" />
                إنشاء كورس
              </button>
            )}
            <Link
              href="/dashboard/teacher/courses"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border hover:bg-muted text-foreground rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
              كورساتي
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-2xl p-5 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-muted mb-3" />
              <div className="h-7 w-16 bg-muted rounded mb-2" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {[
            { label: 'إجمالي الكورسات', value: stats.totalCourses, icon: BookOpen, color: 'bg-primary/10 text-primary', sub: `${stats.publishedCourses} منشور` },
            { label: 'إجمالي الطلاب', value: stats.totalStudents, icon: Users, color: 'bg-info/10 text-info' },
            { label: 'متوسط التقييم', value: stats.averageRating.toFixed(1), icon: Star, color: 'bg-warning/10 text-warning', sub: `${stats.totalReviews} تقييم` },
            { label: 'رصيد المحفظة', value: `${stats.walletBalance} ج`, icon: Wallet, color: 'bg-success/10 text-success', sub: `إجمالي: ${stats.totalEarned} ج` },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/20 transition-colors">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-foreground">{item.value}</p>
              <p className="text-sm font-semibold text-text-muted mt-0.5">{item.label}</p>
              {item.sub && <p className="text-xs text-text-muted mt-1">{item.sub}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Recent Courses */}
      <div className="bg-card border border-border/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            آخر الكورسات
          </h2>
          <Link href="/dashboard/teacher/courses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            عرض الكل <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="font-bold text-foreground">لا توجد كورسات بعد</p>
            <p className="text-sm text-text-muted mt-1">ابدأ بإنشاء أول كورس لك</p>
            <Link href="/dashboard/teacher/courses/create" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
              <Plus className="w-4 h-4" /> إنشاء كورس
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                {course.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.thumbnailUrl} alt={course.title} className="w-14 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{course.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_COLORS[course.status])}>
                      {STATUS_LABELS[course.status] || course.status}
                    </span>
                    <span className="text-xs text-text-muted flex items-center gap-1">
                      <Users className="w-3 h-3" /> {course.enrollmentCount} طالب
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/teacher/courses/${course.id}/edit`} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                    تعديل
                  </Link>
                  <Link href={`/dashboard/teacher/analytics?course=${course.id}`} className="p-1.5 rounded-lg bg-muted text-text-muted hover:text-foreground transition-colors">
                    <BarChart2 className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}