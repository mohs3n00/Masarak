'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Link as LinkIcon, Edit2, CheckCircle } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { Globe, Mail, Phone } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import { parsePlatformUrl } from '@/shared/utils/platform-parser';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BrandingConfig {
  id?: string;
  platform: string;
  url: string;
  isEnabled: boolean;
  showInFooter: boolean;
  showInExport: boolean;
}

const SUPPORTED_PLATFORMS = [
  { id: 'Facebook', icon: FaFacebook, color: 'text-[#1877F2]' },
  { id: 'Instagram', icon: FaInstagram, color: 'text-[#E4405F]' },
  { id: 'YouTube', icon: FaYoutube, color: 'text-[#FF0000]' },
  { id: 'Telegram', icon: FaTelegram, color: 'text-[#229ED9]' },
  { id: 'WhatsApp', icon: FaWhatsapp, color: 'text-[#25D366]' },
  { id: 'Website', icon: Globe, color: 'text-primary' },
  { id: 'Email', icon: Mail, color: 'text-gray-500' },
  { id: 'Phone', icon: Phone, color: 'text-gray-500' },
];

export function PlatformBrandingCard() {
  const [configs, setConfigs] = useState<Record<string, BrandingConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await apiClient.get('/admin/platform-branding');
      const map: Record<string, BrandingConfig> = {};
      SUPPORTED_PLATFORMS.forEach((p) => {
        const existing = res.data.find((c: any) => c.platform === p.id);
        map[p.id] = existing || {
          platform: p.id,
          url: '',
          isEnabled: false,
          showInFooter: true,
          showInExport: true,
        };
      });
      setConfigs(map);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب إعدادات المنصات');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (platform: string, field: keyof BrandingConfig, value: any) => {
    setConfigs((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  };

  const handleSave = async (platform: string) => {
    const config = configs[platform];
    if (config.isEnabled && !config.url) {
      toast.error(`يرجى إدخال الرابط لمنصة ${platform}`);
      return;
    }

    setSaving(platform);
    try {
      await apiClient.patch(`/admin/platform-branding/${platform}`, {
        url: config.url,
        isEnabled: config.isEnabled,
        showInFooter: config.showInFooter,
        showInExport: config.showInExport,
      });
      toast.success(`تم حفظ إعدادات ${platform} بنجاح`);
    } catch (error) {
      toast.error(`فشل حفظ إعدادات ${platform}`);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-card rounded-2xl border border-border/60"></div>;
  }

  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border/60 bg-muted/20">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-primary" />
          روابط المنصة وحسابات التواصل (Platform Branding)
        </h2>
        <p className="text-sm text-text-muted mt-1">
          أدخل الروابط كاملة. سيقوم النظام تلقائياً باستخراج اسم الحساب وعرضه في الفوتر والصور المصدرة.
        </p>
      </div>

      <div className="divide-y divide-border/40 max-h-[500px] overflow-y-auto">
        {SUPPORTED_PLATFORMS.map((platform) => {
          const config = configs[platform.id];
          const parsedDisplay = parsePlatformUrl(platform.id, config.url);
          
          return (
            <div key={platform.id} className="p-5 hover:bg-muted/10 transition-colors">
              <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
                
                {/* Header / Icon */}
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <platform.icon className={cn('w-5 h-5', platform.color)} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{platform.id}</h3>
                    <label className="flex items-center gap-2 mt-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={config.isEnabled}
                        onChange={(e) => handleChange(platform.id, 'isEnabled', e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-text-muted">مفعل</span>
                    </label>
                  </div>
                </div>

                {/* URL Input & Settings */}
                <div className="flex-1 w-full space-y-3">
                  <div>
                    <input
                      type="url"
                      placeholder={`رابط ${platform.id} الكامل (مثال: https://...)`}
                      value={config.url}
                      onChange={(e) => handleChange(platform.id, 'url', e.target.value)}
                      disabled={!config.isEnabled}
                      className="w-full text-sm border-border bg-background rounded-xl px-4 py-2.5 focus:ring-primary focus:border-primary disabled:opacity-50"
                      dir="ltr"
                    />
                    {config.isEnabled && config.url && (
                      <p className="text-xs text-primary font-medium mt-1.5 flex items-center gap-1" dir="ltr">
                        <span className="text-text-muted" dir="rtl">المظهر المستخرج:</span> {parsedDisplay}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                      <input 
                        type="checkbox" 
                        checked={config.showInFooter}
                        onChange={(e) => handleChange(platform.id, 'showInFooter', e.target.checked)}
                        disabled={!config.isEnabled}
                        className="rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
                      />
                      <span className="text-xs font-semibold text-text-muted">عرض في الفوتر (Website Footer)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                      <input 
                        type="checkbox" 
                        checked={config.showInExport}
                        onChange={(e) => handleChange(platform.id, 'showInExport', e.target.checked)}
                        disabled={!config.isEnabled}
                        className="rounded border-border text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
                      />
                      <span className="text-xs font-semibold text-text-muted">عرض في صور التصميم (Exported Images)</span>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="shrink-0 pt-2 lg:pt-0">
                  <button
                    onClick={() => handleSave(platform.id)}
                    disabled={saving === platform.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-bold text-sm disabled:opacity-50"
                  >
                    {saving === platform.id ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
