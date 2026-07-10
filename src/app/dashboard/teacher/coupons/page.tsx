'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/shared/layouts/Containers';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';
import { Ticket, Plus, Trash2, Calendar, Hash, Percent } from 'lucide-react';

export default function TeacherCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    courseId: '',
    type: 'PERCENTAGE',
    value: '',
    maxUses: '',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [couponsRes, coursesRes] = await Promise.all([
        apiClient.get('/teacher/coupons'),
        apiClient.get('/teacher/courses?take=100') // Get all courses for dropdown
      ]);
      setCoupons(couponsRes.data);
      setCourses(coursesRes.data?.data || []);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId || !formData.code || !formData.value) {
      toast.error('يرجى تعبئة الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.post('/teacher/coupons', {
        ...formData,
        value: Number(formData.value),
        maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
        validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
      });
      toast.success('تم إنشاء الكوبون بنجاح');
      setIsCreating(false);
      setFormData({
        code: '',
        courseId: '',
        type: 'PERCENTAGE',
        value: '',
        maxUses: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الإنشاء');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;
    try {
      await apiClient.delete(`/teacher/coupons/${id}`);
      toast.success('تم الحذف بنجاح');
      fetchData();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <>
      <Section className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-xl">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading">إدارة الكوبونات</h1>
              <p className="text-muted-foreground text-sm">قم بإنشاء وتعديل أكواد الخصم لكورساتك</p>
            </div>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)} className="flex items-center gap-2">
            {isCreating ? 'إلغاء' : <><Plus className="w-4 h-4" /> إضافة كوبون</>}
          </Button>
        </div>

        {isCreating && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6">إنشاء كوبون جديد</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold">الكورس</label>
                <select 
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background"
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  required
                >
                  <option value="">اختر الكورس...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">كود الخصم (مثال: FREE100)</label>
                <Input 
                  placeholder="أدخل الكود" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">نوع الخصم</label>
                <select 
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="PERCENTAGE">نسبة مئوية (%)</option>
                  <option value="FIXED">مبلغ ثابت (ج.م)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">قيمة الخصم</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="مثال: 100" 
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {formData.type === 'PERCENTAGE' ? <Percent className="w-4 h-4" /> : 'ج.م'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">أقصى عدد للاستخدام (اختياري)</label>
                <Input 
                  type="number" 
                  placeholder="اتركه فارغاً للاستخدام غير المحدود" 
                  value={formData.maxUses}
                  onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">تاريخ البدء</label>
                <Input 
                  type="date" 
                  value={formData.validFrom}
                  onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">تاريخ الانتهاء (اختياري)</label>
                <Input 
                  type="date" 
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                />
              </div>

              <div className="md:col-span-2 pt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting || !formData.courseId || !formData.code || !formData.value}>
                  {isSubmitting ? 'جاري الإنشاء...' : 'حفظ الكوبون'}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">جاري التحميل...</div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <Ticket className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-bold text-lg mb-2">لا توجد كوبونات</h3>
              <p className="text-muted-foreground mb-6">قم بإنشاء أول كوبون خصم للطلاب الآن</p>
              <Button onClick={() => setIsCreating(true)}>إضافة كوبون</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-4 font-bold">الكود</th>
                    <th className="p-4 font-bold">الكورس</th>
                    <th className="p-4 font-bold">الخصم</th>
                    <th className="p-4 font-bold">الاستخدامات</th>
                    <th className="p-4 font-bold">تاريخ الصلاحية</th>
                    <th className="p-4 font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full font-mono text-sm">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{coupon.course?.title}</td>
                      <td className="p-4 font-bold text-primary">
                        {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${coupon.value} ج.م`}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{coupon.usedCount}</span>
                          {coupon.maxUses && <span className="text-muted-foreground">/ {coupon.maxUses}</span>}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(coupon.validFrom).toLocaleDateString('ar-EG')} 
                          {coupon.validUntil ? ` - ${new Date(coupon.validUntil).toLocaleDateString('ar-EG')}` : ' (مستمر)'}
                        </div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="حذف الكوبون"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

const Users = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
