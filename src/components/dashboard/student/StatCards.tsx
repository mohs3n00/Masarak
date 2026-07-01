'use client';

import { motion } from 'framer-motion';
import { Clock, BookOpen, CheckCircle, Award } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';

export function StatCards() {
  const { stats } = studentMockData;

  const statItems = [
    { title: 'ساعات التعلم', value: stats.studyHours, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'دورات مكتملة', value: stats.coursesCompleted, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { title: 'دروس منتهية', value: stats.lessonsCompleted, icon: BookOpen, color: 'text-warning', bg: 'bg-warning/10' },
    { title: 'الشهادات', value: stats.certificates, icon: Award, color: 'text-info', bg: 'bg-info/10' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div 
            key={idx} 
            variants={item}
            className="flex flex-col p-5 bg-card border border-border/50 rounded-2xl shadow-sm hover:border-primary/30 transition-colors group"
          >
            <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-xs font-medium text-muted-foreground mt-1">{stat.title}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
