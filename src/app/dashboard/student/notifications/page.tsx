'use client';

import { useApi } from '@/lib/providers/ApiProvider';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { Bell, CheckCircle2, Circle, Trophy, BookOpen, Clock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { dataState } = useApi();
  const notifications = dataState === 'empty' ? [] : studentMockData.notifications;

  const getIcon = (title: string) => {
    if (title.includes('Achievement') || title.includes('Badge')) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (title.includes('Course') || title.includes('Assignment')) return <BookOpen className="w-5 h-5 text-blue-500" />;
    if (title.includes('Live')) return <Clock className="w-5 h-5 text-orange-500" />;
    return <Bell className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-text-secondary text-lg">Stay updated on your learning journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/50 hover:bg-muted transition-colors shadow-sm text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </button>
          <button className="text-sm font-bold text-primary hover:text-primary-foreground flex items-center gap-2 bg-primary/10 hover:bg-primary px-5 py-2.5 rounded-xl transition-colors shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      </div>

      <DataStateWrapper emptyType="notifications" emptyMessage="You're all caught up! No new notifications.">
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
          <div className="flex flex-col">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-6 flex items-start gap-5 transition-colors border-b border-border/50 last:border-0 hover:bg-muted/30 cursor-pointer group",
                  notification.unread ? "bg-primary/[0.03]" : ""
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(notification.title)}
                </div>
                
                <div className="flex-1 flex flex-col gap-1.5 pt-1">
                  <div className="flex justify-between items-start">
                    <h3 className={cn("text-base font-bold", notification.unread ? "text-foreground" : "text-text-secondary")}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap ml-4">
                      {notification.time}
                    </span>
                  </div>
                  <p className={cn("text-sm leading-relaxed", notification.unread ? "text-foreground/90 font-medium" : "text-text-secondary")}>
                    {notification.message}
                  </p>
                </div>

                <div className="shrink-0 mt-3 pl-2">
                  {notification.unread ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20 shadow-sm" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-border/50" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DataStateWrapper>
    </div>
  );
}
