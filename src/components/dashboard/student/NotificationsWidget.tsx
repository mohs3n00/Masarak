'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { cn } from '@/lib/utils';

export function NotificationsWidget() {
  const { notifications } = studentMockData;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="p-6 bg-card border border-border/60 rounded-2xl shadow-sm h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-foreground">الإشعارات</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-error/10 text-[10px] font-bold text-error mt-0.5">
            {notifications.filter(n => n.unread).length}
          </span>
        </div>
        <button className="text-[11px] font-semibold text-primary hover:underline transition-colors">تحديد كقروء</button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hidden">
        {notifications.map((notif) => (
          <div key={notif.id} className="relative flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group">
            {notif.unread && (
              <div className="absolute end-1 top-4 h-1.5 w-1.5 rounded-full bg-error" />
            )}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ms-2 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <span className={cn(
                  "text-sm font-semibold truncate transition-colors",
                  notif.unread ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                )}>
                  {notif.title}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{notif.time}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {notif.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
