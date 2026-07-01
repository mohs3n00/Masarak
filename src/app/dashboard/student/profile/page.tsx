'use client';

import React from 'react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { Award, Zap, Star, Flame, Trophy, Clock, Target, Calendar, CheckCircle2 } from 'lucide-react';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { useApi } from '@/lib/providers/ApiProvider';

export default function StudentProfilePage() {
  const { dataState } = useApi();
  const data = dataState === 'empty' ? null : studentMockData;

  if (!data) return <DataStateWrapper emptyMessage="بيانات الملف الشخصي غير متاحة" />;

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-12" dir="rtl">
      
      {/* HEADER / HERO SECTION */}
      <div className="bg-card rounded-3xl border border-border/60 p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 start-0 w-full h-32 bg-gradient-to-r from-primary/10 to-info/10 pointer-events-none" />
        
        {/* Avatar */}
        <div className="relative z-10 w-32 h-32 rounded-full border-4 border-background shadow-xl shrink-0 overflow-hidden bg-muted mt-4 md:mt-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.profile.avatar} alt={data.profile.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="relative z-10 flex flex-col flex-1 text-center md:text-start mt-0 md:mt-12 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-foreground">{data.profile.name}</h1>
              <span className="text-muted-foreground font-medium text-sm">{data.profile.role}</span>
            </div>
            <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md transition-colors self-center md:self-auto text-sm">
              تعديل الملف الشخصي
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">انضم في {data.profile.joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium text-foreground">المستوى {data.profile.level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* RIGHT COLUMN: Stats & Badges (Since RTL, it acts like right sidebar) */}
        <div className="flex flex-col gap-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-info/30 transition-colors">
              <Clock className="w-8 h-8 text-info mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">{data.stats.studyHours}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ساعة</span>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-success/30 transition-colors">
              <CheckCircle2 className="w-8 h-8 text-success mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">{data.stats.lessonsCompleted}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">درس</span>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-warning/30 transition-colors">
              <Flame className="w-8 h-8 text-warning mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">{data.stats.streak}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">سلسلة</span>
            </div>
            <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm flex flex-col items-center text-center hover:border-primary/30 transition-colors">
              <Award className="w-8 h-8 text-primary mb-3 opacity-80" />
              <span className="text-3xl font-black leading-none mb-1.5 text-foreground">{data.stats.certificates}</span>
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
              <span className="font-bold text-2xl text-foreground">مستوى {data.profile.level}</span>
              <span className="text-sm font-medium text-muted-foreground" dir="ltr">{data.profile.xp} / {data.profile.nextLevelXp} XP</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 relative" 
                style={{ width: `${(data.profile.xp / data.profile.nextLevelXp) * 100}%` }} 
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center font-medium">تبقى فقط 500 نقطة خبرة للوصول إلى مستوى {data.profile.level + 1}!</p>
          </div>

        </div>

        {/* LEFT COLUMN: Achievements & Activity */}
        <div className="md:col-span-2 flex flex-col gap-8">
          
          {/* Achievements Grid */}
          <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-warning" /> الشارات والإنجازات
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.achievements.map((ach) => (
                <div key={ach.id} className={`flex flex-col items-center gap-3 p-4 rounded-2xl border border-border/40 text-center transition-all ${ach.unlocked ? 'bg-muted/30 hover:border-warning/30 hover:shadow-sm' : 'opacity-40 grayscale bg-transparent'}`}>
                  <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center shadow-inner border border-warning/20 transition-transform duration-300 hover:scale-110">
                    {ach.icon === 'zap' && <Zap className="w-8 h-8 text-warning" />}
                    {ach.icon === 'flame' && <Flame className="w-8 h-8 text-warning" />}
                    {ach.icon === 'moon' && <Star className="w-8 h-8 text-warning" />}
                    {ach.icon === 'award' && <Award className="w-8 h-8 text-warning" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight mb-1 text-foreground">{ach.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-snug">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates Showcase */}
          <div className="bg-card rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <Award className="w-5 h-5 text-success" /> الشهادات
              </h3>
              <button className="text-xs font-bold text-primary hover:underline transition-colors">عرض الكل</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.certificates.map(cert => (
                <div key={cert.id} className="p-4 rounded-2xl border border-border/60 hover:border-success/30 transition-colors bg-muted/20 flex gap-4 items-center group cursor-pointer hover:shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-sm leading-tight mb-1.5 group-hover:text-primary transition-colors text-foreground">{cert.title}</span>
                    <div className="flex justify-between items-center text-[10px] sm:text-xs text-muted-foreground font-medium">
                      <span>{cert.issueDate}</span>
                      <span className="bg-success/10 text-success px-2 py-0.5 rounded-sm">الدرجة: {cert.grade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
