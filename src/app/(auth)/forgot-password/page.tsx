'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/features/auth/schemas/auth.schemas';
import { authService } from '@/features/auth/services/auth.service';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { Input } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { ApiError } from '@/shared/api/error.models';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.forgotPassword(data.email);
      setSuccess(true);
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
            title="نسيت كلمة المرور؟"
            description="أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك."
          />

          {error && (
            <div className="mb-4 p-3 bg-error/8 text-error text-sm rounded-xl border border-error/20 text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-success/8 text-success text-sm rounded-xl border border-success/20">
                تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground" htmlFor="email">
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@masarak.com"
                  error={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-error font-medium">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full mt-2" loading={isLoading}>
                إرسال رابط إعادة التعيين
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
