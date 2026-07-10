'use client';

import React from 'react';
import { apiClient } from '@/shared/api/api.client';
import { Bell, Check, CheckCircle2, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  link?: string;
  createdAt: string;
}

export function NotificationsList() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await apiClient.get('/users/notifications?take=50');
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/users/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/users/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all read', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-xl">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          الإشعارات
          {unreadCount > 0 && (
            <span className="bg-error text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline flex items-center gap-1 font-medium"
          >
            <CheckCircle2 className="w-4 h-4" />
            تحديد الكل كمقروء
          </button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-foreground">لا توجد إشعارات</h3>
            <p className="text-sm text-muted-foreground mt-1">ليس لديك أي إشعارات جديدة في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-xl border transition-colors',
                  notification.isRead ? 'bg-background border-border/50' : 'bg-primary/5 border-primary/20'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1',
                  notification.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                )}>
                  <Bell className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={cn("font-bold", notification.isRead ? 'text-foreground/80' : 'text-foreground')}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className={cn("text-sm", notification.isRead ? 'text-muted-foreground' : 'text-foreground/90')}>
                    {notification.message}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 hover:bg-black/5 rounded-full text-muted-foreground hover:text-primary transition-colors"
                    title="تحديد كمقروء"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
