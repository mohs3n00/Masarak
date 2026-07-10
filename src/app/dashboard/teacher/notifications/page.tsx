'use client';

import React, { useState } from 'react';
import { NotificationsList } from '@/shared/components/organisms/NotificationsList';
import { apiClient } from '@/shared/api/api.client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Send, Users } from 'lucide-react';

export default function TeacherNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }

    try {
      setIsSending(true);
      await apiClient.post('/teacher/notifications/send', {
        title,
        message,
      });
      toast.success('تم إرسال الإشعار لجميع طلابك بنجاح');
      setTitle('');
      setMessage('');
    } catch (error) {
      console.error(error);
      toast.error('فشل إرسال الإشعار');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Send className="w-8 h-8 text-primary" />
          إرسال إشعار
        </h1>
        <p className="text-muted-foreground">قم بإرسال إشعارات وتنبيهات لجميع الطلاب المسجلين في كورساتك.</p>
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardHeader className="bg-muted/30 border-b pb-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            صيغة الإشعار
          </CardTitle>
          <CardDescription>سيتم إرسال هذا الإشعار لجميع طلابك</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">عنوان الإشعار</label>
              <Input 
                placeholder="مثال: موعد البث المباشر القادم" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">نص الإشعار</label>
              <Textarea 
                placeholder="اكتب رسالتك هنا..." 
                className="min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSending} className="min-w-[150px] gap-2">
                {isSending ? 'جاري الإرسال...' : 'إرسال الإشعار'}
                {!isSending && <Send className="w-4 h-4 rtl:-scale-x-100" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">إشعاراتك</h2>
        <NotificationsList />
      </div>
    </div>
  );
}
