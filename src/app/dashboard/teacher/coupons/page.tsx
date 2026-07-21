'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/shared/layouts/Containers';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';
import { Ticket, Plus, Trash2, Calendar, QrCode, Users, Sparkles, Layers, User, Hash } from 'lucide-react';
import { CouponCardModal } from '@/components/dashboard/teacher/CouponCardModal';

export default function TeacherCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Generated Cards / Printable QR
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalCoupons, setSelectedModalCoupons] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  // Form State
  const [isCreating, setIsCreating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'SINGLE_STUDENT' | 'BATCH_SINGLE_USE' | 'MULTI_USE'>('SINGLE_STUDENT');
  const [formData, setFormData] = useState({
    courseId: '',
    type: 'PERCENTAGE',
    value: '100',
    count: '10',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    customCode: '',
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
        apiClient.get('/teacher/courses?take=100')
      ]);
      setCoupons(couponsRes.data || []);
      setCourses(coursesRes.data?.data || []);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب البيانات');
    } fontally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId) {
      toast.error('يرجى اختيار الكورس أولاً');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.post('/teacher/coupons/generate', {
        courseId: formData.courseId,
        mode: generationMode,
        type: formData.type,
        value: Number(formData.value),
        count: Number(formData.count),
        validFrom: formData.validFrom,
        validUntil: formData.validUntil ? formData.validUntil : undefined,
        customCode: formData.customCode ? formData.customCode.trim() : undefined,
      });

      toast.success(`تم إنشاء الكوبونات بنجاح 🎉 (${res.data.count} كود)`);
      setIsCreating(false);

      // Open Modal with newly generated coupons
      if (res.data?.coupons?.length > 0) {
        setSelectedModalCoupons(res.data.coupons);
        setModalTitle(
          generationMode === 'BATCH_SINGLE_USE'
            ? `دفعة كروت الخصم جاهزة للطباعة (${res.data.count} كارت)`
            : 'كارت الخصم جاهز للطباعة والمشاركة'
        );
        setModalOpen(true);
      }

      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء توليد الكوبونات');
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

  const handleViewCard = (coupon: any) => {
    setSelectedModalCoupons([coupon]);
    setModalTitle(`كارت الكود الخصم: ${coupon.code}`);
    setModalOpen(true);
  };

  return (
    <>
      <Section className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-2xl text-primary shadow-sm">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading">إدارة أكواد الخصم والـ QR Codes</h1>
              <p className="text-muted-foreground text-sm">
                قم بتوليد أكواد الخصم العشوائية وكروت الطلاب بطرق متعددة
              </p>
            </div>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)} className="flex items-center gap-2 rounded-xl">
            {isCreating ? 'إلغاء' : <><Plus className="w-4 h-4" /> توليد كوبونات جديدة</>}
          </Button>
        </div>

        {/* Creation Form */}
        {isCreating && (
          <div className="bg-card border border-primary/20 rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 font-heading">
              <Sparkles className="w-5 h-5 text-primary" />
              توليد أكواد خصم جديدة
            </h3>

            {/* Mode Selection Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setGenerationMode('SINGLE_STUDENT')}
                className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                  generationMode === 'SINGLE_STUDENT'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${generationMode === 'SINGLE_STUDENT' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">كود لطالب واحد فقط</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    كود عشوائي فريد ينتهي بعد الاستخدام الأول
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGenerationMode('BATCH_SINGLE_USE')}
                className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                  generationMode === 'BATCH_SINGLE_USE'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${generationMode === 'BATCH_SINGLE_USE' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">دفعة أكواد مختلفة (مجموعة)</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    توليد عدد N من الكروت المختلفة للطباعة
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGenerationMode('MULTI_USE')}
                className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                  generationMode === 'MULTI_USE'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${generationMode === 'MULTI_USE' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">كود واحد لعدد من الطلاب</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    كود خصم موحد صالح لعدد N من الاستخدامات
                  </div>
                </div>
              </button>
            </div>

            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold">الكورس المستهدف</label>
                <select
                  className="w-full h-12 px-4 rounded-2xl border border-border bg-background font-medium focus:ring-2 focus:ring-primary/40 outline-none"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  required
                >
                  <option value="">اختر الكورس...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.price} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              {generationMode === 'BATCH_SINGLE_USE' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">عدد الكروت المطلوبة (مثال: 10 أو 50)</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="مثال: 10"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                    required
                  />
                </div>
              )}

              {generationMode === 'MULTI_USE' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">أقصى عدد استخدامات للكود (مثال: 10 مرات)</label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="مثال: 10"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold">نوع الخصم</label>
                <select
                  className="w-full h-12 px-4 rounded-2xl border border-border bg-background font-medium focus:ring-2 focus:ring-primary/40 outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="PERCENTAGE">نسبة مئوية (%) - مجاناً 100%</option>
                  <option value="FIXED">مبلغ ثابت (ج.م)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">قيمة الخصم</label>
                <Input
                  type="number"
                  min="1"
                  max={formData.type === 'PERCENTAGE' ? '100' : '10000'}
                  placeholder="مثال: 100"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">تاريخ البدء</label>
                <Input
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">تاريخ الانتهاء (اختياري)</label>
                <Input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>

              {generationMode !== 'BATCH_SINGLE_USE' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold">كود خاص (اختياري - اتركه فارغاً لتوليد كود عشوائي تلقائياً)</label>
                  <Input
                    placeholder="اتركه فارغاً ليقوم النظام بتوليد كود عشوائي مثل MSK-9X4K2P"
                    value={formData.customCode}
                    onChange={(e) => setFormData({ ...formData, customCode: e.target.value.toUpperCase() })}
                  />
                </div>
              )}

              <div className="md:col-span-2 pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.courseId}
                  className="rounded-xl px-8 h-12 font-bold text-base shadow-lg"
                >
                  {isSubmitting ? 'جاري التوليد...' : 'توليد الكروت والـ QR Codes 🚀'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Coupons Table */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">جاري تحميل الكوبونات...</div>
          ) : coupons.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <Ticket className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-bold text-xl mb-2 font-heading">لا توجد كوبونات حالياً</h3>
              <p className="text-muted-foreground mb-6">قم بتوليد أول كوبونات لطلابك الآن</p>
              <Button onClick={() => setIsCreating(true)} className="rounded-xl">
                توليد كوبونات
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="p-4 font-bold">كود الخصم</th>
                    <th className="p-4 font-bold">الكورس</th>
                    <th className="p-4 font-bold">الخصم</th>
                    <th className="p-4 font-bold">الاستخدامات</th>
                    <th className="p-4 font-bold">الصلاحية</th>
                    <th className="p-4 font-bold text-center">الإجراءات والـ QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <span className="bg-primary/10 text-primary border border-primary/20 font-bold px-3 py-1.5 rounded-xl font-mono text-sm inline-block shadow-xs">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="p-4 font-medium max-w-[200px] truncate">
                        {coupon.course?.title || 'عام'}
                      </td>
                      <td className="p-4 font-bold text-primary">
                        {coupon.type === 'PERCENTAGE'
                          ? coupon.value === 100
                            ? 'مجاناً (100%)'
                            : `${coupon.value}%`
                          : `${coupon.value} ج.م`}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-bold">{coupon.usedCount}</span>
                          {coupon.maxUses && (
                            <span className="text-muted-foreground font-normal">
                              / {coupon.maxUses}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(coupon.validFrom).toLocaleDateString('ar-EG')}
                          {coupon.validUntil
                            ? ` - ${new Date(coupon.validUntil).toLocaleDateString('ar-EG')}`
                            : ' (دائم)'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCard(coupon)}
                            className="flex items-center gap-1 text-xs rounded-xl border-primary/30 hover:bg-primary/10"
                          >
                            <QrCode className="w-3.5 h-3.5 text-primary" />
                            الكارت & QR
                          </Button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                            title="حذف الكوبون"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Section>

      {/* Modal Render */}
      <CouponCardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        coupons={selectedModalCoupons}
        title={modalTitle}
      />
    </>
  );
}
