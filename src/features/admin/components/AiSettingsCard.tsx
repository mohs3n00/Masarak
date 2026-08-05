'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Save, AlertCircle } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';

export function AiSettingsCard() {
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await apiClient.get('/admin/feature-flags');
      setIsEnabled(res.data.autoAiSummary ?? true);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب إعدادات الذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    setIsEnabled(enabled);
    setSaving(true);
    try {
      await apiClient.patch('/admin/feature-flags/AUTO_AI_SUMMARY', {
        isEnabled: enabled,
      });
      toast.success(enabled ? 'تم تفعيل الإنشاء التلقائي' : 'تم إيقاف الإنشاء التلقائي');
    } catch (error) {
      setIsEnabled(!enabled); // revert
      toast.error('فشل تحديث إعدادات الذكاء الاصطناعي');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-2xl"></div>;
  }

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">الذكاء الاصطناعي (الملخصات)</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              تفعيل أو تعطيل الإنشاء التلقائي لملخصات الدروس والـ Flashcards بشكل آلي عند فتح الدرس لأول مرة. تعطيل هذه الميزة يمنع استهلاك الـ Tokens تلقائياً.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-semibold">{isEnabled ? 'مفعل' : 'معطل'}</span>
          <button
            onClick={() => handleToggle(!isEnabled)}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${
              isEnabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isEnabled ? '-translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
      
      {!isEnabled && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          الإنشاء التلقائي معطل حالياً. لن يتم إنشاء أي ملخصات تلقائية للدروس الجديدة.
        </div>
      )}
    </div>
  );
}
