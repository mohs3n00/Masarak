import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';

export default function PaymentFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-card shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-border/40">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-error/10 mb-6">
          <XCircle className="h-12 w-12 text-error" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          فشلت عملية الدفع
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          عذراً، حدث خطأ أثناء معالجة الدفع. لم يتم سحب أي مبلغ من حسابك. يرجى المحاولة مرة أخرى أو استخدام طريقة دفع مختلفة.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/courses" className="block">
            <Button size="lg" className="w-full text-lg h-12">
              تصفح الكورسات للمحاولة مجدداً
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="ghost" size="lg" className="w-full text-lg h-12">
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
