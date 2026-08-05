'use client';

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { cn, optimizeImage } from '@/lib/utils';
import {
  BookOpen, Users, PlayCircle, Star, Wallet, TrendingUp,
  Plus, ArrowLeft, BarChart2, Eye, MessageSquare, Layers, Activity, CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

function StatCard({
  title, value, subtitle, icon: Icon, colorClass, highlight
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  colorClass: string;
  highlight?: string;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-black text-foreground tracking-tight">{value.toLocaleString()}</p>
      <p className="text-sm font-semibold text-text-muted mt-1">{title}</p>
      {(subtitle || highlight) && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
          {highlight && <span className="text-primary bg-primary/10 px-2 py-1 rounded-md">{highlight}</span>}
          {subtitle && <span className="text-text-muted">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 mt-8">
      <Icon className="w-5 h-5 text-primary" />
      {title}
    </h2>
  );
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
  const { data, isLoading: loading } = useQuery({
    queryKey: ['teacherAnalytics'],
    queryFn: async () => {
      const [overview, learning, conversations, courses] = await Promise.all([
        apiClient.get('/teacher/analytics/overview').then(r => r.data).catch(() => null),
        apiClient.get('/teacher/analytics/learning').then(r => r.data).catch(() => null),
        apiClient.get('/teacher/analytics/conversations').then(r => r.data).catch(() => null),
        apiClient.get('/teacher/analytics/courses').then(r => r.data).catch(() => []),
      ]);
      return {
        overview: overview || {},
        learning: learning || {},
        conversations: conversations || {},
        courses: courses || [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const { overview, learning, conversations, courses } = data || {};

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مساء الخير';
    return 'مساء النور';
  })();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 md:p-10 shadow-sm group">
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
              يسعدنا تواجدك معنا. إليك ملخص سريع لأداء كورساتك وتفاعلات طلابك.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Link href="/dashboard/teacher/courses/create" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all">
              <Plus className="w-4 h-4" /> إنشاء كورس
            </Link>
            <Link href="/dashboard/teacher/courses" className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border hover:bg-muted text-foreground rounded-xl text-sm font-bold transition-all">
              <Eye className="w-4 h-4 text-muted-foreground" /> كورساتي
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 h-32" />
          ))}
        </div>
      ) : (
        <>
          {/* Section: Courses Overview */}
          <SectionHeader title="نظرة عامة على الكورسات" icon={Layers} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="إجمالي الكورسات" value={overview?.totalCourses ?? 0} highlight={`${overview?.publishedCourses ?? 0} منشور`} icon={BookOpen} colorClass="bg-primary/10 text-primary" />
            <StatCard title="كورسات قيد المسودة" value={overview?.draftCourses ?? 0} icon={BookOpen} colorClass="bg-muted text-text-muted" />
            <StatCard title="إجمالي الطلاب" value={overview?.totalStudents ?? 0} icon={Users} colorClass="bg-info/10 text-info" />
            <StatCard title="محفظة الأرباح (تقريبي)" value="--- ج" icon={Wallet} colorClass="bg-success/10 text-success" />
          </div>

          {/* Section: Learning Progress & Conversations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <SectionHeader title="تقدم الطلاب (التعلم)" icon={Activity} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="متوسط الإنجاز للكورسات" value={`${Math.round(learning?.averageCompletionRate ?? 0)}%`} icon={TrendingUp} colorClass="bg-primary/10 text-primary" />
                <StatCard title="دروس تم إكمالها" value={learning?.lessonsCompleted ?? 0} icon={PlayCircle} colorClass="bg-success/10 text-success" />
              </div>
            </div>
            <div>
              <SectionHeader title="المحادثات الأكاديمية" icon={MessageSquare} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="أسئلة بانتظار ردك" value={conversations?.questionsWaiting ?? 0} highlight={conversations?.unread ? `${conversations.unread} رسالة غير مقروءة` : undefined} icon={MessageSquare} colorClass="bg-warning/10 text-warning" />
                <StatCard title="تم الرد (اليوم)" value={conversations?.answeredToday ?? 0} icon={CheckCircle} colorClass="bg-indigo-500/10 text-indigo-500" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Course Analytics List */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            تحليلات الكورسات
          </h2>
        </div>

        {courses?.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="font-bold text-foreground">لا توجد كورسات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses?.map((course: any) => (
              <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{course.title}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', STATUS_COLORS[course.status])}>
                      {STATUS_LABELS[course.status] || course.status}
                    </span>
                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {course.enrollments} اشتراك
                    </span>
                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {Math.round(course.completionRate)}% الإنجاز
                    </span>
                    <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {course.questions} سؤال
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/dashboard/teacher/analytics?course=${course.id}`} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                    تحليل مفصل
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