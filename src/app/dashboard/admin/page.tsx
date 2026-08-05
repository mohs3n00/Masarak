'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users, GraduationCap, BookOpen, TrendingUp,
  CheckCircle, XCircle, ArrowLeft, ShoppingBag,
  Bell, UserCheck, MessageSquare, PlayCircle, Layers, Activity, AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import { PlatformBrandingCard } from '@/features/admin/components/PlatformBrandingCard';
import { AiSettingsCard } from '@/features/admin/components/AiSettingsCard';
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
    <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm hover:border-primary/30 hover:shadow-[0px_8px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0px_8px_40px_rgba(0,0,0,0.2)] transition-all duration-200">
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

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading: loading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const [overview, activity, conversations, community, learning, teachersRes] = await Promise.all([
        apiClient.get('/admin/analytics/overview').then(r => r.data).catch(() => null),
        apiClient.get('/admin/analytics/activity').then(r => r.data).catch(() => null),
        apiClient.get('/admin/analytics/conversations').then(r => r.data).catch(() => null),
        apiClient.get('/admin/analytics/community').then(r => r.data).catch(() => null),
        apiClient.get('/admin/analytics/learning').then(r => r.data).catch(() => null),
        apiClient.get('/admin/teachers?take=5&status=PENDING').catch(() => ({ data: { data: [] } })),
      ]);
      return {
        overview: overview || {},
        activity: activity || {},
        conversations: conversations || {},
        community: community || {},
        learning: learning || {},
        recentTeachers: teachersRes.data?.data || teachersRes.data || [],
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const { overview, activity, conversations, community, learning, recentTeachers } = data || {};

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مساء الخير';
    return 'مساء النور';
  })();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className="absolute -top-40 -end-40 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-foreground tracking-tight flex items-center gap-2">
              {greeting}، {user?.name || 'مسؤول'}
              <span className="animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-muted-foreground text-[15px] max-w-xl leading-relaxed">
              تحليلات النظام ومؤشرات الأداء الرئيسية (KPIs).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/admin/notifications" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors">
              <Bell className="w-4 h-4" /> إشعارات
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 h-32" />
          ))}
        </div>
      ) : (
        <>
          {/* Section: Platform Overview */}
          <SectionHeader title="نظرة عامة على المنصة" icon={Layers} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="إجمالي الطلاب" value={overview?.totalStudents ?? 0} icon={Users} colorClass="bg-blue-500/10 text-blue-500" />
            <StatCard title="إجمالي المدرسين" value={overview?.totalTeachers ?? 0} icon={GraduationCap} colorClass="bg-indigo-500/10 text-indigo-500" />
            <StatCard title="إجمالي الكورسات" value={overview?.totalCourses ?? 0} icon={BookOpen} colorClass="bg-purple-500/10 text-purple-500" highlight={`${overview?.publishedCourses ?? 0} منشور`} />
            <StatCard title="إجمالي الاشتراكات" value={overview?.totalEnrollments ?? 0} icon={ShoppingBag} colorClass="bg-green-500/10 text-green-500" highlight={`${overview?.activeEnrollments ?? 0} نشط`} />
          </div>

          {/* Section: Activity */}
          <SectionHeader title="نشاط المنصة (هذا الأسبوع)" icon={Activity} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="تسجيلات جديدة" value={activity?.registrations?.week ?? 0} subtitle={`${activity?.registrations?.today ?? 0} اليوم`} icon={Users} colorClass="bg-primary/10 text-primary" />
            <StatCard title="اشتراكات جديدة" value={activity?.enrollments?.week ?? 0} subtitle={`${activity?.enrollments?.today ?? 0} اليوم`} icon={ShoppingBag} colorClass="bg-success/10 text-success" />
            <StatCard title="مستخدمين نشطين" value={activity?.activeUsers?.week ?? 0} subtitle={`${activity?.activeUsers?.today ?? 0} اليوم`} icon={TrendingUp} colorClass="bg-warning/10 text-warning" />
            <StatCard title="محادثات جديدة" value={activity?.conversations?.week ?? 0} subtitle={`${activity?.conversations?.today ?? 0} اليوم`} icon={MessageSquare} colorClass="bg-info/10 text-info" />
          </div>

          {/* Section: Learning & Community */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <SectionHeader title="التعلم الأكاديمي" icon={PlayCircle} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="دروس مكتملة (اليوم)" value={learning?.lessonsCompletedToday ?? 0} icon={CheckCircle} colorClass="bg-success/10 text-success" />
                <StatCard title="وقت المشاهدة (دقائق)" value={learning?.totalVideoWatchTimeMinutes ?? 0} icon={PlayCircle} colorClass="bg-primary/10 text-primary" />
                <StatCard title="متوسط نسبة الإنجاز" value={`${Math.round(learning?.averageCompletionRate ?? 0)}%`} icon={TrendingUp} colorClass="bg-info/10 text-info" />
              </div>
            </div>
            <div>
              <SectionHeader title="المجتمعات الأكاديمية" icon={Users} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="إجمالي المجتمعات" value={community?.totalSpaces ?? 0} highlight={`${community?.approvedSpaces ?? 0} معتمد`} icon={Users} colorClass="bg-indigo-500/10 text-indigo-500" />
                <StatCard title="مجتمعات قيد المراجعة" value={community?.pendingSpaces ?? 0} icon={AlertTriangle} colorClass="bg-warning/10 text-warning" />
                <StatCard title="إجمالي المنشورات" value={community?.totalPosts ?? 0} icon={MessageSquare} colorClass="bg-primary/10 text-primary" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Quick Actions + Pending Teachers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 border-t border-border/50">
        <div className="lg:col-span-2 bg-card border border-border/40 rounded-3xl p-6 shadow-[0px_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_40px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-warning" />
              المدرسون بانتظار الموافقة
            </h2>
            <Link href="/dashboard/admin/teachers?filter=pending" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          
          {recentTeachers?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-12 h-12 text-success mb-3" />
              <p className="font-bold text-foreground">لا توجد طلبات معلقة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTeachers?.map((teacher: any) => (
                <div key={teacher.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {teacher.name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{teacher.name}</p>
                      <p className="text-xs text-text-muted">{teacher.phone}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/admin/teachers/${teacher.id}`} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                    مراجعة
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-[0px_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_40px_rgba(0,0,0,0.2)]">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            روابط سريعة
          </h2>
          <div className="space-y-2">
            {[
              { label: 'المجتمعات', href: '/dashboard/admin/community', icon: Users, color: 'text-indigo-500' },
              { label: 'إضافة كورس', href: '/dashboard/admin/courses', icon: BookOpen, color: 'text-primary' },
              { label: 'المدرسين', href: '/dashboard/admin/teachers', icon: GraduationCap, color: 'text-warning' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                <link.icon className={cn('w-4 h-4 shrink-0', link.color)} />
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{link.label}</span>
                <ArrowLeft className="w-3.5 h-3.5 ms-auto text-text-muted group-hover:text-primary group-hover:-translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <AiSettingsCard />
      <PlatformBrandingCard />
    </div>
  );
}