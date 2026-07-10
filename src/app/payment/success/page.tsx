import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-card shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-border/40">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-success/10 mb-6">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          تم الدفع بنجاح
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          تم تأكيد عملية الدفع وتسجيلك في الكورس بنجاح. يمكنك الآن البدء في التعلم فوراً.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/student" className="block">
            <Button size="lg" className="w-full text-lg h-12">
              الذهاب إلى دوراتي
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
