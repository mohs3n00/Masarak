'use client';

import React from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/api.client';
import { cn, optimizeImage } from '@/lib/utils';
import {
  BookOpen, Flame, Clock, Award, Target,
  ArrowLeft, ChevronLeft, Bell, Trophy,
  PlayCircle, Star, TrendingUp, Zap,
} from 'lucide-react';

interface DashboardData {
  user: { id: string; name: string; avatar?: string; grade?: string; track?: string };
  stats: {
    totalEnrollments: number;
    completedCourses: number;
    completedLessons: number;
    studyHoursTotal: number;
    streak: number;
    longestStreak: number;
  };
  enrolledCourses: Array<{
    enrollmentId: string;
    enrolledAt: string;
    course: { id: string; title: string; slug: string; thumbnailUrl?: string; grade?: string; teacherName?: string };
    progress: { completionPct: number; lastAccessedAt?: string };
  }>;
  recentNotifications: Array<{
    id: string; title: string; message: string; isRead: boolean; type: string; createdAt: string;
  }>;
}

import { useQuery } from '@tanstack/react-query';

export default function StudentDashboardPage() {
  const { data, isLoading: loading } = useQuery<DashboardData>({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/student/dashboard');
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مساء الخير';
    return 'مساء النور';
  })();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 bg-muted rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-muted rounded-2xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <BookOpen className="w-16 h-16 text-text-muted mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">مرحباً بك في مسارك!</h2>
        <p className="text-sm text-text-muted mb-6">تصفح الكورسات المتاحة لتبدأ رحلتك</p>
        <Link href="/courses" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm">
          تصفح الكورسات المتاحة
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 md:p-10 shadow-[0px_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_40px_rgba(0,0,0,0.2)] group">
        {/* Decorative Background Pattern instead of glows */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c13.866 0 25.362 10.24 26.882 23.635l.025.263C38.22 55.452 49.333 65 62 65c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 27.548 100.333 18 113 18V0C96.432 0 82.5 12.09 80.203 28.188l-.025.263C79.866 41.76 68.37 52 55 52c-13.866 0-25.362-10.24-26.882-23.635l-.025-.263C27.78 14.548 16.667 5 4 5V23c16.568 0 30.5 12.09 32.797 28.188l.025.263C37.134 64.24 48.63 74.48 62 74.48c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 37.028 100.333 27.48 113 27.48V9.48c-16.568 0-30.5-12.09-32.797-28.188l-.025-.263C79.866 5.48 68.37-4.76 55-4.76c-13.866 0-25.362 10.24-26.882 23.635l-.025.263C27.78 32.48 16.667 42.028 4 42.028v18c16.568 0 30.5 12.09 32.797 28.188l.025.263C37.134 101.98 48.63 112.22 62 112.22c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 74.768 100.333 65.22 113 65.22V47.22c-16.568 0-30.5-12.09-32.797-28.188l-.025-.263C79.866 5.48 68.37-4.76 55-4.76c-13.866 0-25.362 10.24-26.882 23.635l-.025.263C27.78 32.48 16.667 42.028 4 42.028z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '150px' 
          }} 
        />
        
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1 text-center md:text-start">
            <h1 className="text-3xl font-extrabold mb-2 text-foreground tracking-tight flex items-center justify-center md:justify-start gap-2">
              {greeting}، {
                data.user.name ? (
                  data.user.name.split(' ').length > 2 
                    ? `${data.user.name.split(' ')[0]} ${data.user.name.split(' ').pop()}`
                    : data.user.name
                ) : 'طالب'
              }
              <span className="animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-muted-foreground text-[15px] max-w-xl leading-relaxed mb-5">
              مرحباً بك في مسارك التعليمي. نأمل أن تقضي وقتاً ممتعاً ومفيداً في تعلم المزيد اليوم.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {data.user.grade && (
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold border border-primary/20">
                  🎓 {data.user.grade}{data.user.track ? ` — ${data.user.track}` : ''}
                </span>
              )}
              {data.stats.streak > 0 && (
                <div className="flex items-center gap-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-4 py-2 rounded-xl">
                  <Flame className="w-4 h-4" />
                  <span className="font-bold text-sm">{data.stats.streak} يوم متتالي</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative shrink-0">
            {data.user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={data.user.avatar} 
                alt={data.user.name} 
                className="w-24 h-24 rounded-[1.5rem] object-cover shadow-lg ring-4 ring-background z-10 relative" 
              />
            ) : (
              <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-primary/80 to-indigo-600/80 shadow-lg ring-4 ring-background flex items-center justify-center text-3xl font-black text-white z-10 relative">
                {data.user.name?.[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-110 z-0" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'الكورسات المسجلة', value: data.stats.totalEnrollments, icon: BookOpen, color: 'bg-primary/10 text-primary' },
          { label: 'الدروس المنتهية', value: data.stats.completedLessons, icon: Award, color: 'bg-success/10 text-success' },
          { label: 'ساعات الدراسة', value: data.stats.studyHoursTotal, icon: Clock, color: 'bg-info/10 text-info', suffix: 'س' },
          { label: 'أطول سلسلة', value: data.stats.longestStreak, icon: Flame, color: 'bg-warning/10 text-warning', suffix: 'يوم' },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm hover:shadow-[0px_8px_40px_rgba(0,0,0,0.04)] dark:hover:shadow-[0px_8px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {item.value}{item.suffix ? ` ${item.suffix}` : ''}
            </p>
            <p className="text-sm font-semibold text-text-muted mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 bg-card border border-border/40 rounded-3xl p-6 shadow-[0px_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_40px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              كورساتي
            </h2>
            <Link href="/dashboard/student/courses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              الكل <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>

          {data.enrolledCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="font-bold text-foreground mb-2">لم تسجل في أي كورس بعد</p>
              <Link href="/courses" className="text-sm text-primary font-bold hover:underline">
                تصفح الكورسات المتاحة
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.enrolledCourses.map((item) => (
                <Link
                  key={item.enrollmentId}
                  href={`/dashboard/student/course/${item.course.slug || item.course.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  {item.course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={optimizeImage(item.course.thumbnailUrl)} alt={item.course.title} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {item.course.title}
                    </p>
                    {item.course.teacherName && (
                      <p className="text-xs text-text-muted mt-0.5">{item.course.teacherName}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(item.progress.completionPct, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text-muted shrink-0">
                        {Math.round(item.progress.completionPct)}%
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-[0px_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0px_8px_40px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              الإشعارات
            </h2>
            {data.recentNotifications.some(n => !n.isRead) && (
              <span className="text-xs font-bold px-2 py-1 bg-error/10 text-error rounded-full">
                {data.recentNotifications.filter(n => !n.isRead).length} جديد
              </span>
            )}
          </div>

          {data.recentNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-10 h-10 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn('p-3 rounded-xl transition-colors', notif.isRead ? 'bg-muted/30' : 'bg-primary/5 border border-primary/10')}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', notif.isRead ? 'bg-border' : 'bg-primary')} />
                    <div>
                      <p className="text-xs font-bold text-foreground">{notif.title}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-text-muted mt-1">
                        {new Date(notif.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/student/notifications" className="block text-center text-xs font-bold text-primary hover:underline pt-2">
                عرض كل الإشعارات
              </Link>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
