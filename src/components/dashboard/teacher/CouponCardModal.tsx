'use client';

import React, { useRef } from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { X, Printer, Download, Sparkles, CheckCircle2, Ticket } from 'lucide-react';
import { toast } from 'sonner';

interface CouponItem {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses?: number | null;
  usedCount?: number;
  validFrom: string;
  validUntil?: string | null;
  teacherName?: string;
  course?: {
    id: string;
    title: string;
    price: number;
  };
}

interface CouponCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: CouponItem[];
  title?: string;
}

export const CouponCardModal: React.FC<CouponCardModalProps> = ({
  isOpen,
  onClose,
  coupons,
  title = 'كروت الخصم جاهزة للطباعة والمشاركة 🎟️',
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || coupons.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`تم نسخ الكود ${code} بنجاح!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      {/* Print-specific style override */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-coupon-grid, .printable-coupon-grid * {
            visibility: visible;
          }
          .printable-coupon-grid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-xl text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading">{title}</h2>
              <p className="text-sm text-muted-foreground">
                إجمالي {coupons.length} كارت خصم بالهوية البصرية والـ QR Code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" /> طباعة الكروت
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1" ref={printRef}>
          <div className="printable-coupon-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon) => {
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                coupon.code
              )}`;
              const discountText =
                coupon.type === 'PERCENTAGE'
                  ? coupon.value === 100
                    ? 'مجاناً 100%'
                    : `خصم ${coupon.value}%`
                  : `خصم ${coupon.value} ج.م`;

              return (
                <div
                  key={coupon.id}
                  className="relative group bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-primary/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Glass Background Shapes */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Row: Platform Brand & Teacher Info */}
                  <div className="flex items-start justify-between border-b border-white/10 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                        م
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-indigo-300 font-bold">
                          منصة مسارك التعليمية
                        </div>
                        <div className="font-bold text-sm text-slate-200">
                          أ/ {coupon.teacherName || 'معلم المادة'}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full flex items-center gap-1 shadow-inner">
                      <Ticket className="w-3.5 h-3.5" />
                      {discountText}
                    </span>
                  </div>

                  {/* Body: Course Title & QR Code */}
                  <div className="py-6 flex items-center justify-between gap-4 relative z-10">
                    <div className="space-y-2 flex-1">
                      <span className="text-xs text-slate-400 block font-medium">اسم الكورس</span>
                      <h4 className="font-bold text-base line-clamp-2 text-white font-heading">
                        {coupon.course?.title || 'جميع كورسات المدرس'}
                      </h4>
                      <div className="text-xs text-slate-400 pt-1">
                        {coupon.maxUses === 1 ? (
                          <span className="text-amber-300 font-semibold">صالح لطالب واحد فقط</span>
                        ) : coupon.maxUses ? (
                          <span className="text-indigo-300 font-semibold">
                            صالح لـ {coupon.maxUses} استخدامات
                          </span>
                        ) : (
                          <span className="text-emerald-300 font-semibold">استخدام مفتوح</span>
                        )}
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center bg-white p-2.5 rounded-2xl shadow-xl shrink-0">
                      <img
                        src={qrUrl}
                        alt={`QR ${coupon.code}`}
                        className="w-24 h-24 object-contain rounded-lg"
                      />
                      <span className="text-[10px] text-slate-800 font-mono font-bold mt-1 tracking-tighter">
                        امسح بالكاميرا
                      </span>
                    </div>
                  </div>

                  {/* Footer Row: Code Box & Copy Action */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">كود الخصم</span>
                      <div className="font-mono text-xl font-black text-amber-400 tracking-wider">
                        {coupon.code}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCopyCode(coupon.code)}
                      variant="outline"
                      className="no-print bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs rounded-xl"
                    >
                      نسخ الكود
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex justify-end no-print">
          <Button onClick={onClose} variant="outline">
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};
