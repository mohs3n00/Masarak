'use client';

import { motion } from 'framer-motion';
import { Award, Zap, Moon, Flame, Lock } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { cn } from '@/lib/utils';

export function AchievementsWidget() {
  const { achievements } = studentMockData;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'moon': return <Moon className="h-5 w-5" />;
      case 'award': return <Award className="h-5 w-5" />;
      case 'flame': return <Flame className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="p-6 bg-card border border-border/60 rounded-2xl shadow-sm h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-foreground">آخر الإنجازات</h2>
        <button className="text-[11px] font-semibold text-primary hover:underline transition-colors">عرض الكل</button>
      </div>

      <div className="flex flex-col gap-4">
        {achievements.slice(0, 3).map((ach) => (
          <div key={ach.id} className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-muted/40 transition-colors">
            <div className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300",
              ach.unlocked 
                ? "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110" 
                : "bg-muted text-muted-foreground"
            )}>
              {ach.unlocked ? getIcon(ach.icon) : <Lock className="h-4 w-4" />}
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-sm font-semibold transition-colors",
                ach.unlocked ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
              )}>
                {ach.title}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{ach.description}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
