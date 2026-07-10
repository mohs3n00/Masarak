'use client';

import React, { useEffect, useState } from 'react';
import { User, Bell, Lock, CreditCard, Palette, Settings, Loader2 } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [form, setForm] = useState({
    name: '',
    bio: '',
    academicYear: '',
    learningPreferences: '',
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/users/me')
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          bio: data.bio || '',
          academicYear: data.studentProfile?.academicYear || '',
          learningPreferences: data.studentProfile?.learningPreferences || '',
        });
        setAvatar(data.avatar);
      })
      .catch(() => toast.error('فشل تحميل الإعدادات'))
      .finally(() => setFetching(false));
  }, []);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiClient.patch('/users/me', { name: form.name, bio: form.bio });
      await apiClient.patch('/users/profile/student', {
        academicYear: form.academicYear,
        learningPreferences: form.learningPreferences,
      });
      toast.success('تم حفظ التغييرات بنجاح');
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await apiClient.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatar(data.avatar);
      toast.success('تم تحديث الصورة الشخصية');
    } catch {
      toast.error('فشل رفع الصورة');
    }
  };

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
  ];

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-12" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">الإعدادات</h1>
        <p className="text-muted-foreground text-sm">إدارة تفضيلات حسابك وإعدادات النظام.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-card border border-border/60 rounded-3xl p-3 shadow-sm flex flex-col gap-1 sticky top-24">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-border/60 rounded-3xl p-6 lg:p-10 shadow-sm">
          
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-8 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold mb-1">الملف الشخصي العام</h2>
                <p className="text-muted-foreground text-xs">سيتم عرض هذه المعلومات للعامة.</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md shrink-0 bg-muted">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40 bg-primary/5">
                      {form.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <label className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/90 transition-colors shadow-sm cursor-pointer">
                    تغيير الصورة
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                  {avatar && (
                    <button 
                      onClick={() => {
                        apiClient.delete('/users/avatar').then(() => setAvatar(null));
                      }}
                      className="px-5 py-2.5 bg-error/10 text-error font-bold rounded-xl text-xs hover:bg-error hover:text-white transition-colors shadow-sm"
                    >
                      إزالة
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-6">
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-foreground">الاسم الكامل</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground focus:bg-background" />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-xs font-bold text-foreground">الصف الدراسي</label>
                  <input type="text" value={form.academicYear} onChange={e => update('academicYear', e.target.value)} placeholder="مثال: الصف الأول الثانوي" className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground focus:bg-background" />
                </div>

                <div className="grid gap-2">
                  <label className="text-xs font-bold text-foreground">نبذة شخصية (Bio)</label>
                  <textarea rows={4} value={form.bio} onChange={e => update('bio', e.target.value)} className="w-full bg-muted/40 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-foreground focus:bg-background" placeholder="اكتب نبذة قصيرة عن نفسك..." />
                </div>
              </div>

              <div className="pt-6 border-t border-border/60">
                <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto disabled:opacity-50">
                  {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
}
