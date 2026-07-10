'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '@/features/auth/schemas/auth.schemas';
import { authService } from '@/features/auth/services/auth.service';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { PasswordInput } from '@/shared/components/atoms/Input';
import { PasswordStrength } from '@/shared/components/atoms/PasswordStrength';
import { Button } from '@/shared/components/atoms/Button';
import { ApiError } from '@/shared/api/error.models';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('رابط إعادة تعيين كلمة المرور غير صالح أو مفقود.');
    }
  }, [email, code]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email || !code) return;
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword({ email, code, newPassword: data.password });
      setSuccess(true);
      setTimeout(() => {
        router.push(AUTH_ROUTES.LOGIN);
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GuestGuard>
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="إعادة تعيين كلمة المرور"
            description="يرجى إدخال كلمة المرور الجديدة الخاصة بك."
          />

          {error && (
            <div className="mb-4 p-3 bg-error/8 text-error text-sm rounded-xl border border-error/20 text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-success/8 text-success text-sm rounded-xl border border-success/20">
                تمت إعادة تعيين كلمة المرور بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground" htmlFor="password">
                  كلمة المرور الجديدة
                </label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  error={!!errors.password}
                  disabled={!email || !code}
                  {...register('password')}
                />
                <PasswordStrength password={passwordValue} />
                {errors.password && (
                  <p className="text-xs text-error font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground" htmlFor="confirmPassword">
                  تأكيد كلمة المرور
                </label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="••••••••"
                  error={!!errors.confirmPassword}
                  disabled={!email || !code}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-error font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full mt-2" loading={isLoading} disabled={!email || !code}>
                حفظ كلمة المرور الجديدة
              </Button>
            </form>
          )}

          <AuthFooter
            question="تذكرت كلمة المرور؟"
            actionText="العودة لتسجيل الدخول"
            actionHref={AUTH_ROUTES.LOGIN}
          />
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
