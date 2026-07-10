'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight, ChevronLeft, Image as ImageIcon, Link as LinkIcon, CheckCircle } from 'lucide-react';

const GRADES = ['الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي'];
const STEPS = ['المعلومات الأساسية', 'التفاصيل', 'الصورة'];

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [form, setForm] = React.useState({
    title: '', description: '', grade: '', price: 0, originalPrice: 0,
    accessType: 'PAID', difficulty: '', thumbnailUrl: '',
  });

  const update = (field: string, value: string | number) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { 
        ...form, 
        price: Number(form.price), 
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        difficulty: form.difficulty || undefined 
      };
      const { data } = await apiClient.post('/teacher/courses', payload);
      setSuccess(true);
      setTimeout(() => router.push(`/dashboard/teacher/courses`), 1500);
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">تم إنشاء الكورس بنجاح!</h2>
        <p className="text-text-muted">جاري تحويلك...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />إنشاء كورس جديد
        </h1>
      </div>
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all', i === step ? 'bg-primary text-primary-foreground' : i < step ? 'bg-success/10 text-success' : 'bg-muted text-text-muted')}>
              <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs font-black', i === step ? 'bg-white text-primary' : i < step ? 'bg-success text-white' : 'bg-border text-text-muted')}>
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </div>
            {i < STEPS.length - 1 && <div className={cn('flex-1 h-px', i < step ? 'bg-success' : 'bg-border')} />}
          </React.Fragment>
        ))}
      </div>
      <div className="bg-card border border-border/60 rounded-2xl p-6">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">عنوان الكورس *</label>
              <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)}
                placeholder="مثال: رياضيات أول ثانوي"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">وصف الكورس *</label>
              <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
                placeholder="اشرح ما سيتعلمه الطلاب..." rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background focus:border-primary outline-none text-sm resize-none" />
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">الصف الدراسي</label>
                <select value={form.grade} onChange={(e) => update('grade', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background outline-none text-sm">
                  <option value="">اختر الصف</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">طريقة الوصول</label>
                <select value={form.accessType} onChange={(e) => update('accessType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background outline-none text-sm">
                  <option value="PAID">مدفوع</option>
                  <option value="FREE">مجاني</option>
                </select>
              </div>
            </div>

            {form.accessType === 'PAID' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold mb-2">السعر الأصلي (قبل الخصم)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => update('originalPrice', Number(e.target.value))} min={0}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">السعر بعد الخصم (الحالي)</label>
                  <input type="number" value={form.price} onChange={(e) => update('price', Number(e.target.value))} min={0}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background outline-none text-sm" />
                </div>
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2"><LinkIcon className="w-4 h-4 inline me-1" />الصورة</label>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setLoading(true);
                setError('');
                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('folder', 'masarak/courses');
                  const { data } = await apiClient.post('/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  update('thumbnailUrl', data.url || data.secure_url);
                } catch (err) {
                  setError('فشل رفع الصورة');
                } finally {
                  setLoading(false);
                }
              }}
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:bg-background outline-none text-sm" />
              <p className="text-xs text-text-muted mt-2">
                يمكنك تركه فارغاً الآن وإضافته لاحقاً. ولا يشترط أبعاد معينة للصورة، سيتم ضبطها تلقائياً.
              </p>
            </div>
            {form.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.thumbnailUrl} alt="Preview" className="w-full aspect-video object-cover rounded-xl border border-border" onError={() => update('thumbnailUrl', '')} />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-border p-12 flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-text-muted mb-3" />
                <p className="text-sm font-semibold text-text-muted">لا توجد صورة</p>
              </div>
            )}
            {error && <p className="text-sm text-error font-semibold">{error}</p>}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-6">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-text-muted hover:text-foreground hover:bg-muted disabled:opacity-40">
          <ChevronRight className="w-4 h-4" />السابق
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => {
            if (step === 0 && !form.title.trim()) { setError('عنوان الكورس مطلوب'); return; }
            if (step === 0 && !form.description.trim()) { setError('الوصف مطلوب'); return; }
            setError(''); setStep(s => s + 1);
          }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary-hover">
            التالي<ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-success text-white text-sm font-bold hover:bg-emerald-600 disabled:opacity-50">
            {loading ? 'جاري الإنشاء...' : '✓ إنشاء الكورس'}
          </button>
        )}
      </div>
      {error && step < 2 && <p className="text-sm text-error font-semibold mt-3">{error}</p>}
    </div>
  );
}
