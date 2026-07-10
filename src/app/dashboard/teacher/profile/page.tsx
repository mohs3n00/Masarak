'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { apiClient } from '@/shared/api/api.client';
import { User, CheckCircle, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    bio: '',
    title: '',
    qualifications: '',
    experience: 0,
    teachingSubjects: '',
    academicLevels: '',
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [dbSubjects, setDbSubjects] = useState<{name: string}[]>([]);

  useEffect(() => {
    apiClient.get('/users/me')
      .then(({ data }) => {
        setForm({
          name: data.name || '',
          bio: data.bio || '',
          title: data.teacherProfile?.title || '',
          qualifications: data.teacherProfile?.qualifications || '',
          experience: data.teacherProfile?.experience || 0,
          teachingSubjects: (data.teacherProfile?.teachingSubjects || []).join(', '),
          academicLevels: (data.teacherProfile?.academicLevels || []).join(', '),
        });
        setAvatar(data.avatar);
      })
      .catch(() => {
        toast.error('فشل تحميل الملف الشخصي');
      })
      .finally(() => setFetching(false));

    apiClient.get('/academic/subjects')
      .then((res) => setDbSubjects(res.data.items || res.data || []))
      .catch(console.error);
  }, []);

  const update = (field: string, value: string | number) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await apiClient.patch('/users/me', {
        name: form.name,
        bio: form.bio,
      });

      await apiClient.patch('/users/profile/teacher', {
        title: form.title,
        qualifications: form.qualifications,
        experience: Number(form.experience),
        teachingSubjects: form.teachingSubjects.split(',').map(s => s.trim()).filter(Boolean),
        academicLevels: form.academicLevels.split(',').map(s => s.trim()).filter(Boolean),
      });

      setSuccess(true);
      toast.success('تم حفظ التعديلات بنجاح');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'حدث خطأ أثناء الحفظ');
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

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-text-muted">جاري تحميل الملف الشخصي...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <User className="w-6 h-6 text-primary" /> الملف الشخصي
        </h1>
        <p className="text-text-muted text-sm mt-1">قم بتحديث بياناتك ليراها الطلاب في المنصة</p>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-l from-primary/20 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-muted shadow-lg">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40 bg-primary/5">
                    {form.name?.[0]?.toUpperCase() || 'M'}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
            <span className="text-xs font-bold text-success bg-success/10 px-3 py-1 rounded-full">
              حساب معلم
            </span>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-sm font-bold mb-2">الاسم بالكامل</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">المسمى الوظيفي (مثال: أستاذ أول رياضيات)</label>
              <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm font-medium" />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border/60 rounded-3xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">نبذة تعريفية (Bio)</label>
          <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={4}
            placeholder="اكتب نبذة عنك وعن طريقة تدريسك..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm resize-none font-medium" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">المؤهلات العلمية</label>
            <input type="text" value={form.qualifications} onChange={e => update('qualifications', e.target.value)}
              placeholder="مثال: دكتوراه في الرياضيات"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">سنوات الخبرة</label>
            <input type="number" value={form.experience} onChange={e => update('experience', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm font-medium" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">المراحل الدراسية (مفصولة بفاصلة)</label>
            <input type="text" value={form.academicLevels} onChange={e => update('academicLevels', e.target.value)}
              placeholder="الأول الثانوي، الثاني الثانوي..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">المواد الدراسية (التخصص - مفصولة بفاصلة)</label>
            <input type="text" value={form.teachingSubjects} onChange={e => update('teachingSubjects', e.target.value)}
              placeholder="الفيزياء، الكيمياء..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm font-medium" />
          </div>
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-end">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-black hover:bg-primary-hover disabled:opacity-50 transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            {success ? 'تم الحفظ!' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </div>
  );
}
