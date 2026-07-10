'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Trash2, Hash } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { toast } from 'sonner';
import { apiClient } from '@/shared/api/api.client';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENTAGE');
  const [value, setValue] = useState(10);
  const [maxUses, setMaxUses] = useState(100);
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/admin/coupons?take=50');
      setCoupons(res.data?.data || []);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب الكوبونات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !validFrom) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await apiClient.post('/admin/coupons', {
        code,
        type,
        value,
        maxUses: maxUses || undefined,
        validFrom,
        validUntil: validUntil || undefined,
      });
      toast.success('تم إضافة الكوبون بنجاح');
      setIsModalOpen(false);
      fetchCoupons();
      
      // Reset form
      setCode('');
      setType('PERCENTAGE');
      setValue(10);
      setMaxUses(100);
      setValidFrom(new Date().toISOString().split('T')[0]);
      setValidUntil('');
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة الكوبون');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      try {
        await apiClient.delete(`/admin/coupons/${id}`);
        toast.success('تم حذف الكوبون بنجاح');
        fetchCoupons();
      } catch (error) {
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الكوبونات والخصومات</h1>
          <p className="text-sm text-foreground-muted">إدارة كوبونات الخصم للمنصة</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة كوبون
        </Button>
      </div>

      <div className="bg-surface rounded-2xl border border-border-subtle p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <Input 
              placeholder="ابحث برمز الكوبون..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-foreground-muted">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="text-xs text-foreground-muted uppercase bg-background rounded-t-lg">
                <tr>
                  <th className="px-6 py-4 rounded-tr-lg">رمز الكوبون</th>
                  <th className="px-6 py-4">النوع</th>
                  <th className="px-6 py-4">القيمة</th>
                  <th className="px-6 py-4">الاستخدامات</th>
                  <th className="px-6 py-4">تاريخ البداية</th>
                  <th className="px-6 py-4">تاريخ الانتهاء</th>
                  <th className="px-6 py-4 rounded-tl-lg text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-border-subtle hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        {coupon.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {coupon.type === 'PERCENTAGE' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                    </td>
                    <td className="px-6 py-4 font-bold text-success">
                      {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${coupon.value} ر.س`}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {coupon.usedCount} / {coupon.maxUses || 'âˆž'}
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">
                      {new Date(coupon.validFrom).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">
                      {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString('ar-EG') : 'بدون انتهاء'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon.id)} className="text-error hover:bg-error/10 hover:text-error">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border-subtle rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-xl font-bold text-foreground">إضافة كوبون جديد</h2>
            </div>
            
            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">رمز الكوبون</label>
                <Input 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: NEW2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">النوع</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border-subtle bg-background text-foreground"
                  >
                    <option value="PERCENTAGE">نسبة مئوية</option>
                    <option value="FIXED">مبلغ ثابت</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">القيمة</label>
                  <Input 
                    type="number"
                    min="1"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الحد الأقصى للاستخدام (اختياري)</label>
                <div className="relative">
                  <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                  <Input 
                    type="number"
                    min="1"
                    className="pr-10"
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">تاريخ البداية</label>
                  <div className="relative">
                    <Input 
                      type="date"
                      className="pr-10"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">تاريخ الانتهاء (اختياري)</label>
                  <div className="relative">
                    <Input 
                      type="date"
                      className="pr-10"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  حفظ الكوبون
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
