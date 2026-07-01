'use client';

import React from 'react';
import Link from 'next/link';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { useApi } from '@/lib/providers/ApiProvider';
import { 
  PlayCircle, Flame, Clock, Award, Target, 
  Calendar as CalendarIcon, ArrowLeft, ChevronLeft,
  BookOpen, Star, FileText, Bell, Trophy, Zap
} from 'lucide-react';
import { WelcomeCard } from '@/components/dashboard/student/WelcomeCard';
import { StatCards } from '@/components/dashboard/student/StatCards';
import { ContinueLearningCard } from '@/components/dashboard/student/ContinueLearningCard';
import { RecommendedCourses } from '@/components/dashboard/student/RecommendedCourses';
import { AchievementsWidget } from '@/components/dashboard/student/AchievementsWidget';
import { CalendarWidget } from '@/components/dashboard/student/CalendarWidget';
import { NotificationsWidget } from '@/components/dashboard/student/NotificationsWidget';
import { StudyChartWidget } from '@/components/dashboard/student/StudyChartWidget';

export default function StudentDashboardPage() {
  const { dataState } = useApi();
  const data = dataState === 'empty' ? null : studentMockData;

  if (!data) {
    return (
      <DataStateWrapper emptyMessage="مرحباً بك في مسارك! تصفح دوراتنا لتبدأ رحلة التعلم." />
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full pb-12" dir="rtl">
      
      {/* HERO SECTION: Welcome & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Welcome & Resume Block */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-8 md:p-10 text-primary-foreground shadow-lg flex flex-col justify-between min-h-[320px]">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 end-0 w-96 h-96 bg-white/10 blur-3xl rounded-full -translate-y-1/2 -translate-x-1/3 mix-blend-overlay pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-64 h-64 bg-black/10 blur-2xl rounded-full translate-y-1/3 translate-x-1/3 mix-blend-overlay pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide mb-4">
              مرحباً بعودتك، {data.profile.name.split(' ')[0]} 👋
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-xl">
              جاهز لتحقيق أهدافك اليوم؟
            </h1>
            <p className="text-primary-foreground/90 text-sm md:text-base max-w-lg mb-8 leading-relaxed">
              أنت الآن في سلسلة تعلم لمدة {data.stats.streak} أيام متتالية. حافظ على هذا الزخم الرائع!
            </p>
          </div>

          {/* Continue Learning Glass Card */}
          <div className="relative z-10 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-center justify-between w-full shadow-lg">
            <div className="flex items-center gap-5 w-full">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-white/20 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.continueLearning.thumbnail} alt="Course" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/70 mb-1">
                  متابعة التعلم
                </span>
                <span className="font-bold text-base md:text-lg leading-tight line-clamp-1">
                  {data.continueLearning.title}
                </span>
                <span className="text-xs text-primary-foreground/90 flex items-center gap-1.5 mt-1">
                  <PlayCircle className="w-4 h-4 opacity-80 shrink-0"/> 
                  <span className="truncate">{data.continueLearning.currentLesson}</span>
                </span>
              </div>
            </div>
            
            <Link href={`/dashboard/student/course/${data.continueLearning.id}/player`} className="group flex items-center justify-center gap-2 bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto shrink-0 shadow-lg">
              استكمال <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* STATS PILLAR */}
        <div className="flex flex-col gap-4 h-full">
          {/* Streak */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 flex flex-col justify-center h-full shadow-sm hover:border-warning/30 hover:shadow-warning/5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">السلسلة الحالية</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-foreground">{data.stats.streak}</span>
              <span className="text-sm text-muted-foreground font-medium">أيام</span>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 flex flex-col justify-center h-full shadow-sm hover:border-info/30 hover:shadow-info/5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center text-info group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">إجمالي الوقت</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight text-foreground">{data.stats.studyHours}</span>
              <span className="text-sm text-muted-foreground font-medium">ساعة</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'كورساتي', icon: BookOpen, href: '/dashboard/student/courses', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'الجدول', icon: CalendarIcon, href: '/dashboard/student/calendar', color: 'text-error', bg: 'bg-error/10' },
          { label: 'ملاحظاتي', icon: FileText, href: '/dashboard/student/notes', color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'الشهادات', icon: Award, href: '/dashboard/student/certificates', color: 'text-success', bg: 'bg-success/10' },
          { label: 'الإنجازات', icon: Trophy, href: '/dashboard/student/profile', color: 'text-info', bg: 'bg-info/10' },
          { label: 'الإشعارات', icon: Bell, href: '/dashboard/student/notifications', color: 'text-primary', bg: 'bg-primary/10' },
        ].map((action, idx) => (
          <Link key={idx} href={action.href} className="flex flex-col items-center justify-center gap-3 p-4 rounded-3xl border border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30 transition-all group shadow-sm hover:shadow-md">
            <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RIGHT COLUMN: 2/3 Width (Because RTL) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Learning Goals */}
          <div className="bg-card rounded-3xl border border-border/60 p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 end-0 p-8 opacity-5 pointer-events-none">
              <Target className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" /> أهداف التعلم
              </h2>
              <button className="text-xs font-bold text-primary hover:underline">تعديل الأهداف</button>
            </div>
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>ساعات التعلم الأسبوعية</span>
                  <span className="text-primary">12 / 15 ساعة</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000 relative" style={{ width: '80%' }}>
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>إنهاء فصل التفاضل والتكامل</span>
                  <span className="text-info">68%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-info rounded-full transition-all duration-1000 relative" style={{ width: '68%' }}>
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements & Community combined widget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Announcements */}
            <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <Bell className="w-5 h-5 text-primary" /> الإعلانات
                </h3>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                {data.notifications.slice(0, 3).map(notif => (
                  <div key={notif.id} className="flex gap-3 group cursor-pointer">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{notif.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{notif.message}</span>
                      <span className="text-[10px] font-medium text-muted-foreground mt-1.5">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/student/notifications" className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors pt-4 border-t border-border/50">
                عرض كل الإعلانات <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Community Highlights */}
            <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <Star className="w-5 h-5 text-warning" /> مجتمع مسارك
                </h3>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {[
                  { name: 'عمر خالد', text: 'لقد شاركت للتو ملخصاً للفصل الأول في الميكانيكا!', avatar: 'https://i.pravatar.cc/150?u=1' },
                  { name: 'د. فوزي', text: 'تم تثبيت جدول المراجعة الأسبوعية.', avatar: 'https://i.pravatar.cc/150?u=2' },
                  { name: 'سارة أحمد', text: 'من يريد الانضمام لمجموعة دراسة الأحياء؟', avatar: 'https://i.pravatar.cc/150?u=3' },
                ].map((post, idx) => (
                  <div key={idx} className="flex gap-3 group cursor-pointer p-3 -mx-3 rounded-2xl hover:bg-muted/50 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.avatar} alt="User" className="w-10 h-10 rounded-full border border-border/60 shrink-0" />
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-sm flex items-center gap-1.5 text-foreground">{post.name}</span>
                      <span className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/community/feed" className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors pt-4 border-t border-border/50">
                دخول المجتمع <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

        {/* LEFT COLUMN: 1/3 Width (Because RTL) */}
        <div className="flex flex-col gap-6">
          
          {/* Calendar Widget Alternative */}
          <CalendarWidget />

          {/* Achievements Preview */}
          <AchievementsWidget />

        </div>
      </div>

    </div>
  );
}
