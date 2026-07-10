'use client';

import React, { useEffect, useState } from 'react';
import { Award, Zap, Star, Flame, Trophy, Clock, Target, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';
import Link from 'next/link';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/users/me')
      .then(({ data }) => setProfile(data))
      .catch(() => toast.error('فشل تحميل الملف الشخصي'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const joinDate = new Date(profile.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  const grade = profile.studentProfile?.grade || 'غير محدد';
  const streak = profile.studentProfile?.streakDays || 0;
  const level = 1;
  const xp = 0;
  const nextLevelXp = 1000;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-12" dir="rtl">
      
      {/* HEADER / HERO SECTION */}
      <div className="bg-card rounded-3xl border border-border/60 p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 start-0 w-full h-32 bg-gradient-to-r from-primary/10 to-info/10 pointer-events-none" />
        
        {/* Avatar */}
        <div className="relative z-10 w-32 h-32 rounded-full border-4 border-background shadow-xl shrink-0 overflow-hidden bg-muted mt-4 md:mt-12">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl font-black text-primary/40 bg-primary/5">
              {profile.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative z-10 flex flex-col flex-1 text-center md:text-start mt-0 md:mt-12 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-foreground">{profile.name}</h1>
              <span className="text-muted-foreground font-medium text-sm">طالب - {grade}</span>
              {profile.bio && <p className="text-sm mt-2 text-foreground max-w-md">{profile.bio}</p>}
            </div>
            <Link href="/dashboard/student/settings" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md transition-colors self-center md:self-auto text-sm">
              تعديل الملف الشخصي
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">انضم في {joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-foreground">المستوى {level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* RIGHT COLUMN: Stats & Badges */}
        <div className="flex flex-col gap-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-info/30 transition-colors">
              <Clock className="w-8 h-8 text-info mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">0</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ساعة</span>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-success/30 transition-colors">
              <CheckCircle2 className="w-8 h-8 text-success mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">0</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">درس</span>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-warning/30 transition-colors">
              <Flame className="w-8 h-8 text-warning mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">{streak}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">سلسلة الأيام</span>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-primary/30 transition-colors">
              <Award className="w-8 h-8 text-primary mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">0</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">شهادة</span>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Target className="w-5 h-5 text-primary" /> تقدم المستوى
              </h3>
            </div>
            <div className="flex items-end justify-between mb-2.5">
              <span className="font-bold text-2xl text-foreground">مستوى {level}</span>
              <span className="text-sm font-medium text-muted-foreground" dir="ltr">{xp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 relative" 
                style={{ width: `${(xp / nextLevelXp) * 100}%` }} 
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center font-medium">ابدأ مشاهدة الدروس لجمع نقاط الخبرة!</p>
          </div>

        </div>

        {/* LEFT COLUMN: Achievements & Activity */}
        <div className="md:col-span-2 flex flex-col gap-8">
          
          {/* Achievements Grid */}
          <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-warning" /> الشارات والإنجازات
            </h3>
            <div className="text-center py-10 opacity-50">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-bold">لم تحصل على شارات بعد.</p>
              <p className="text-xs text-muted-foreground mt-1">أكمل أول كورس لك لفتح شارة البداية!</p>
            </div>
          </div>

          {/* Certificates Showcase */}
          <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Award className="w-5 h-5 text-success" /> الشهادات
              </h3>
            </div>
            <div className="text-center py-10 opacity-50">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-bold">لا توجد شهادات.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
