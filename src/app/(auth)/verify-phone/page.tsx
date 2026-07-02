'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyPhoneSchema, VerifyPhoneFormData } from '@/features/auth/schemas/auth.schemas';
import { authService } from '@/features/auth/services/auth.service';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { OTPInput } from '@/features/auth/components/OTPInput';
import { Button } from '@/shared/components/atoms/Button';
import { VerificationStatus } from '@/features/auth/components/VerificationStatus';
import { ApiError } from '@/shared/api/error.models';

export default function VerifyPhonePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyPhoneFormData>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: { code: '' },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const codeValue = watch('code');

  const onSubmit = async (data: VerifyPhoneFormData) => {
    try {
      setIsLoading(true);
      setStatus('loading');
      await authService.verifyPhone(data.code);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('حدث خطأ أثناء التحقق من الرمز. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setValue('code', '');
  };

  if (status !== 'idle') {
    return (
      <GuestGuard>
        <AuthLayout>
          <AuthCard>
            <VerificationStatus
              status={status as "success" | "error" | "loading"}
              message={errorMessage}
              onRetry={handleRetry}
            />
          </AuthCard>
        </AuthLayout>
      </GuestGuard>
    );
  }

  return (
    <GuestGuard>
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="تحقق من رقم الهاتف"
            description="أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى رقم هاتفك."
          />

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
              تأكيد الحساب
            </Button>
          </form>

          <AuthFooter
            question="لم تتلق الرمز؟"
            actionText="إعادة الإرسال"
            actionHref="#"
          />
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
