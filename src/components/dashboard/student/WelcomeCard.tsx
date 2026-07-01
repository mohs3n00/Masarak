'use client';

import { motion } from 'framer-motion';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export function WelcomeCard() {
  const { profile } = studentMockData;

  // Split name but handle Arabic correctly if it's already in Arabic
  const firstName = profile.name.split(' ')[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm"
    >
      <div className="flex flex-col gap-2 relative z-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          مرحباً بعودتك، {firstName}
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          أنت الآن في <span className="font-bold text-primary">سلسلة تعلم متتالية لمدة {profile.streak} أيام</span>. استمر في هذا الزخم الرائع وحقق أهدافك اليوم!
        </p>
      </div>

      <div className="flex gap-3 relative z-10 w-full md:w-auto">
        <div className="flex flex-col bg-muted/40 rounded-xl p-4 border border-border/50 flex-1 md:flex-none min-w-[120px]">
          <span className="text-[10px] font-semibold text-muted-foreground mb-1">إجمالي النقاط</span>
          <span className="text-xl font-bold text-foreground">{profile.xp.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">XP</span></span>
        </div>
        <div className="flex flex-col bg-primary/8 rounded-xl p-4 border border-primary/20 flex-1 md:flex-none min-w-[120px]">
          <span className="text-[10px] font-semibold text-primary mb-1">المستوى الحالي</span>
          <span className="text-xl font-bold text-primary">مستوى {profile.level}</span>
        </div>
      </div>

      {/* Decorative gradient background (very subtle) */}
      <div className="absolute end-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
    </motion.div>
  );
}
