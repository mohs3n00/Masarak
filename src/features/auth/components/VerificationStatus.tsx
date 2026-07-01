import React from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button, buttonVariants } from '@/shared/components/atoms/Button';
import Link from 'next/link';
import { AUTH_ROUTES } from '../constants/auth.constants';

type VerificationState = 'loading' | 'success' | 'error';

interface VerificationStatusProps {
  status: VerificationState;
  message?: string;
  onRetry?: () => void;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ status, message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">جاري التحقق...</h3>
          <p className="text-muted-foreground">الرجاء الانتظار بينما نقوم بالتحقق من بريدك الإلكتروني.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="h-12 w-12 text-success mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">تم التحقق بنجاح!</h3>
          <p className="text-muted-foreground mb-6">{message || 'تم تأكيد بريدك الإلكتروني بنجاح.'}</p>
          <Link href={AUTH_ROUTES.LOGIN} className={buttonVariants({ className: "w-full" })}>تسجيل الدخول</Link>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="h-12 w-12 text-error mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">فشل التحقق</h3>
          <p className="text-muted-foreground mb-6">{message || 'الرابط غير صالح أو منتهي الصلاحية.'}</p>
          {onRetry ? (
            <Button onClick={onRetry} className="w-full">
              إعادة المحاولة
            </Button>
          ) : (
              <Link href={AUTH_ROUTES.LOGIN} className={buttonVariants({ className: "w-full" })}>العودة لتسجيل الدخول</Link>
          )}
        </>
      )}
    </div>
  );
};
