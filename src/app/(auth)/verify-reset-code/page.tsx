'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/features/auth/services/auth.service';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { OTPInput } from '@/features/auth/components/OTPInput';
import { Button } from '@/shared/components/atoms/Button';
import { ApiError } from '@/shared/api/error.models';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';

const verifyCodeSchema = z.object({
  code: z.string().length(6, { message: 'رمز التحقق يجب أن يكون 6 أرقام' }),
});
type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

export default function VerifyResetCodePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const em = params.get('email');
    if (!em) {
      router.push(AUTH_ROUTES.FORGOT_PASSWORD);
    } else {
      setEmail(em);
    }
  }, [router]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
  });

  const codeValue = watch('code');

  const onSubmit = async (data: VerifyCodeFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!email) {
        throw new Error('لم يتم العثور على البريد الإلكتروني. يرجى المحاولة مرة أخرى.');
      }

      await authService.verifyResetCode(email, data.code);
      
      toast.success('تم التحقق بنجاح');
      
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(data.code)}`);
      }, 1000);
      
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err.message || 'حدث خطأ أثناء التحقق من الرمز. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect
  }

  return (
    <GuestGuard>
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="تحقق من الرمز"
            description={`أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى ${email}`}
          />

          {error && (
            <div className="mb-4 p-3 bg-error/8 text-error text-sm rounded-xl border border-error/20 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
            <div className="flex flex-col items-center">
              <OTPInput
                length={6}
                value={codeValue}
                onChange={(val) => setValue('code', val, { shouldValidate: true })}
                error={errors.code?.message}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" loading={isLoading} disabled={codeValue.length !== 6}>
              التحقق من الرمز
            </Button>
          </form>

          <AuthFooter
            question="لم تتلق الرمز؟"
            actionText="العودة لإعادة الإرسال"
            actionHref={AUTH_ROUTES.FORGOT_PASSWORD}
          />
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
