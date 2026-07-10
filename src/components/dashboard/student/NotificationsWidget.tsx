'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export function NotificationsWidget() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await apiClient.get('/users/notifications?take=5');
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/users/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
  };

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
            {notifications.filter(n => !n.isRead).length}
          </span>
        </div>
        <button onClick={markAllAsRead} className="text-[11px] font-semibold text-primary hover:underline transition-colors">تحديد كمقروء</button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hidden">
        {loading ? (
          <div className="text-center text-xs text-muted-foreground py-4">جاري التحميل...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-4">لا توجد إشعارات جديدة</div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="relative flex items-start gap-3 p-2 -mx-2 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group">
              {!notif.isRead && (
                <div className="absolute end-1 top-4 h-1.5 w-1.5 rounded-full bg-error" />
              )}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ms-2 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className={cn(
                    "text-sm font-semibold truncate transition-colors",
                    !notif.isRead ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                  )}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{formatTime(notif.createdAt)}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {notif.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/dashboard/student/notifications" className="mt-auto pt-4 text-center text-xs font-bold text-primary hover:underline transition-colors block">
        عرض جميع الإشعارات
      </Link>
    </motion.div>
  );
}
