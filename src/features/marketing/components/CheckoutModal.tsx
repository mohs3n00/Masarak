'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, Ticket, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  originalPrice: number;
}

export function CheckoutModal({ isOpen, onClose, courseId, originalPrice }: CheckoutModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const [validatedCoupon, setValidatedCoupon] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState(originalPrice);

  const router = useRouter();

  if (!isOpen) return null;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      setIsApplying(true);
      const res = await apiClient.post('/student/checkout/apply-coupon', {
        courseId,
        code: couponCode,
      });

      if (res.data?.success) {
        setValidatedCoupon(res.data.coupon);
        setFinalPrice(res.data.finalPrice);
        toast.success('تم تطبيق الخصم بنجاح!');
      }
    } catch (error: any) {
      toast.error(error.message || 'كود الخصم غير صحيح أو منتهي الصلاحية');
      setValidatedCoupon(null);
      setFinalPrice(originalPrice);
    } finally {
      setIsApplying(false);
    }
  };

  const handleEnroll = async () => {
    if (finalPrice > 0) {
      toast.error('بوابة الدفع الإلكتروني مغلقة حالياً. يجب استخدام كود خصم 100% من معلمك للالتحاق بهذا الكورس.');
      return;
    }

    try {
      setIsEnrolling(true);
      const res = await apiClient.post('/student/checkout/enroll', { 
        courseId,
        couponCode: validatedCoupon?.code
      });
      
      if (res.data?.success) {
        toast.success('تم الانضمام للكورس بنجاح!');
        onClose();
        router.push(`/dashboard/student/course/${courseId}`);
      }
    } catch (error: any) {
      if (error.message === 'You are already enrolled in this course') {
        onClose();
        router.push(`/dashboard/student/course/${courseId}`);
        return;
      }
      toast.error(error.message || 'حدث خطأ أثناء إتمام الاشتراك');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <h3 className="font-bold text-lg">إتمام الاشتراك</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {finalPrice > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-amber-700 dark:text-amber-300 text-xs font-medium leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <p className="font-bold text-sm mb-0.5">بوابة الدفع الإلكتروني مغلقة حالياً</p>
                <p>يلزم الحصول على كود خصم بنسبة 100% من معلمك للاشتراك في هذا الكورس لحين توافر بوابة الدفع، ولا يمكن التجاوز بدون الكود.</p>
              </div>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-xl border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">السعر الأصلي:</span>
              <span className="font-bold line-through text-muted-foreground">{originalPrice} ج.م</span>
            </div>
            {validatedCoupon && (
              <div className="flex justify-between items-center mb-2 text-primary">
                <span>قيمة الخصم:</span>
                <span className="font-bold">
                  - {validatedCoupon.type === 'PERCENTAGE' ? `${validatedCoupon.value}%` : `${validatedCoupon.value} ج.م`}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
              <span className="font-bold text-lg">السعر النهائي:</span>
              <span className="font-black text-2xl text-primary">{finalPrice} ج.م</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold flex items-center gap-2">
              <Ticket className="w-4 h-4 text-muted-foreground" />
              هل لديك كود خصم من معلمك؟
            </label>
            <div className="flex gap-2">
              <Input 
                placeholder="أدخل كود الخصم هنا" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!validatedCoupon || isApplying}
              />
              {!validatedCoupon ? (
                <Button onClick={handleApplyCoupon} disabled={!couponCode || isApplying}>
                  {isApplying ? 'جاري...' : 'تطبيق'}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setValidatedCoupon(null);
                    setCouponCode('');
                    setFinalPrice(originalPrice);
                  }}
                >
                  إلغاء
                </Button>
              )}
            </div>
            {validatedCoupon && (
              <div className="flex items-center gap-2 text-sm text-green-500 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                تم تفعيل كود الخصم بنجاح!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <Button 
            size="lg" 
            className="w-full text-lg font-bold"
            onClick={handleEnroll}
            disabled={isEnrolling}
          >
            {isEnrolling ? 'جاري الانضمام...' : (finalPrice === 0 ? 'إتمام الاشتراك مجاناً (كود 100%)' : 'احصل على كود خصم 100% من معلمك')}
          </Button>
        </div>
      </div>
    </div>
  );
}
