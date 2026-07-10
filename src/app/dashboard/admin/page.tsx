'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users, GraduationCap, BookOpen, TrendingUp,
  CheckCircle, XCircle, Clock, ArrowLeft,
  BarChart2, ShoppingBag, Bell, Settings,
  UserCheck, AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import { PlatformBrandingCard } from '@/features/admin/components/PlatformBrandingCard';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  pendingTeachers: number;
  totalOrders: number;
  totalEnrollments: number;
}

interface RecentActivity {
  id: string;
  type: 'teacher_registered' | 'student_registered' | 'course_published' | 'order_placed';
  message: string;
  time: string;
}

function StatCard({
  label, value, icon: Icon, href, color, change,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href: string;
  color: string;
  change?: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
            <Icon className="w-6 h-6" />
          </div>
          <ArrowLeft className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors group-hover:-translate-x-1 transition-transform" />
        </div>
        <p className="text-3xl font-black text-foreground tracking-tight">{value.toLocaleString()}</p>
        <p className="text-sm font-semibold text-text-muted mt-1">{label}</p>
        {change && (
          <p className="text-xs text-success font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {change}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [recentTeachers, setRecentTeachers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, teachersRes] = await Promise.all([
          apiClient.get('/admin/stats').catch(() => ({ data: null })),
          apiClient.get('/admin/teachers?take=5&status=PENDING').catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data || {
          totalStudents: 0,
          totalTeachers: 0,
          totalCourses: 0,
          pendingTeachers: 0,
          totalOrders: 0,
          openTickets: 0,
        });
        setRecentTeachers(teachersRes.data?.data || teachersRes.data || []);
      } catch {
        /* use empty defaults */
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm group">
        {/* Decorative Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className="absolute -top-40 -end-40 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-foreground tracking-tight flex items-center gap-2">
              {greeting}، أستاذ {user?.name || 'مسؤول'}
              <span className="animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-muted-foreground text-[15px] max-w-xl leading-relaxed">
              إليك نظرة عامة على أداء المنصة اليوم.
            </p>
          </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/notifications"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            <Bell className="w-4 h-4" />
            إشعار جديد
          </Link>
        </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-2xl p-6 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-muted mb-4" />
              <div className="h-8 w-24 bg-muted rounded mb-2" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="إجمالي الطلاب"
            value={stats?.totalStudents ?? 0}
            icon={Users}
            href="/dashboard/admin/students"
            color="bg-primary/10 text-primary"
            change="+12 هذا الأسبوع"
          />
          <StatCard
            label="إجمالي المدرسين"
            value={stats?.totalTeachers ?? 0}
            icon={GraduationCap}
            href="/dashboard/admin/teachers"
            color="bg-success/10 text-success"
          />
          <StatCard
            label="إجمالي الكورسات"
            value={stats?.totalCourses ?? 0}
            icon={BookOpen}
            href="/dashboard/admin/courses"
            color="bg-info/10 text-info"
          />
          <StatCard
            label="مدرسون بانتظار الموافقة"
            value={stats?.pendingTeachers ?? 0}
            icon={UserCheck}
            href="/dashboard/admin/teachers?filter=pending"
            color="bg-warning/10 text-warning"
          />
          <StatCard
            label="إجمالي الطلبات"
            value={stats?.totalOrders ?? 0}
            icon={ShoppingBag}
            href="/dashboard/admin/orders"
            color="bg-purple-500/10 text-purple-500"
          />
          <StatCard
            label="إجمالي الاشتراكات"
            value={stats?.totalEnrollments ?? 0}
            icon={ShoppingBag}
            href="/dashboard/admin/students"
            color="bg-primary/10 text-primary"
          />
        </div>
      )}

      {/* Quick Actions + Pending Teachers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Teachers */}
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-warning" />
              المدرسون بانتظار الموافقة
            </h2>
            <Link
              href="/dashboard/admin/teachers?filter=pending"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          
          {recentTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-12 h-12 text-success mb-3" />
              <p className="font-bold text-foreground">لا توجد طلبات معلقة</p>
              <p className="text-sm text-text-muted">جميع طلبات المدرسين تمت معالجتها</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTeachers.map((teacher: any) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {teacher.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {teacher.name?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-foreground">{teacher.name}</p>
                      <p className="text-xs text-text-muted">{teacher.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-bold hover:bg-success hover:text-white transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" />
                      قبول
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs font-bold hover:bg-error hover:text-white transition-colors">
                      <XCircle className="w-3.5 h-3.5" />
                      رفض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-card border border-border/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            روابط سريعة
          </h2>
          <div className="space-y-2">
            {[
              { label: 'إضافة كورس جديد', href: '/dashboard/admin/courses', icon: BookOpen, color: 'text-primary' },
              { label: 'الهيكل الأكاديمي', href: '/dashboard/admin/academic', icon: GraduationCap, color: 'text-success' },
              { label: 'المدرسين', href: '/dashboard/admin/teachers', icon: Users, color: 'text-warning' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <link.icon className={cn('w-4 h-4 shrink-0', link.color)} />
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 ms-auto text-text-muted group-hover:text-primary group-hover:-translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Platform Branding Settings */}
      <div className="grid grid-cols-1 gap-6">
        <PlatformBrandingCard />
      </div>
    </div>
  );
}