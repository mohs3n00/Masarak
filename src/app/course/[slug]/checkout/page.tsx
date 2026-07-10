'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPublicCourse, PublicCourse } from '@/lib/api/public';
import { checkoutCourse } from '@/lib/api/payments';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, CreditCard } from 'lucide-react';
import { ProtectedGuard } from '@/features/auth/components/guards/ProtectedGuard';

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPublicCourse(params.slug);
        if (!data) {
          toast.error('الكورس غير موجود');
          router.push('/courses');
          return;
        }
        setCourse(data);
      } catch (err) {
        toast.error('حدث خطأ أثناء تحميل تفاصيل الكورس');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.slug, router]);

  const handleCheckout = async () => {
    if (!course) return;
    setProcessing(true);
    try {
      const { clientSecret } = await checkoutCourse(course.id);
      
      const publicKey = process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('Public key missing');
      }

      // Redirect to Paymob unified checkout
      const paymobUrl = `https://next.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
      window.location.href = paymobUrl;
      
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'فشلت عملية الدفع');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <ProtectedGuard>
    <div className="container py-12 max-w-2xl">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            إتمام عملية الدفع
          </h1>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8">
            <div className="flex gap-4 items-start mb-6">
              {course.thumbnailUrl && (
                <Image 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-xl"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
                  {course.title}
                </h3>
                {course.teacher && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    تقديم: {course.teacher.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-300">السعر</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {course.price === 0 ? 'مجاناً' : `${course.price} EGP`}
              </span>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg"
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-5 w-5" />
            )}
            {processing ? 'جاري التحويل للدفع...' : 'ادفع الآن'}
          </Button>

          <p className="text-center text-sm text-slate-500 mt-4">
            سيتم تحويلك إلى صفحة الدفع الآمنة الخاصة بـ Paymob
          </p>
        </div>
      </div>
    </div>
    </ProtectedGuard>
  );
}
