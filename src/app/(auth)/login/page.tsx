'use client';

import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/auth.schemas';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { PasswordInput, Input } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { RememberMe } from '@/features/auth/components/RememberMe';

import { ApiError } from '@/shared/api/error.models';

import signInImage from '@/assets/images/sgin in.png';

function LoginForm() {
  const searchParams = useSearchParams();
  const { setAuth, setLoading, setError, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      const { user, tokens } = await authService.login(data);
      setAuth(user, tokens);
      const redirectPath = searchParams.get('redirect') || '/';
      window.location.href = redirectPath;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <AuthLayout 
        title="مرحباً بعودتك إلى مسارك"
        subtitle="سعداء برؤيتك مجدداً، واصل مسيرتك التعليمية."
        illustration={signInImage}
      >
        <AuthCard>
          <AuthHeader
            title="تسجيل الدخول إلى حسابك"
            description="مرحباً بعودتك! يرجى إدخال بياناتك للمتابعة."
          />

          {error && (
            <div className="mb-4 p-3 bg-error/8 text-error text-sm rounded-xl border border-error/20 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground" htmlFor="identifier">
                رقم الهاتف
              </label>
              <Input
                id="identifier"
                type="tel"
                dir="ltr"
                autoComplete="tel username"
                placeholder="01012345678"
                error={!!errors.identifier}
                {...register('identifier')}
              />
              {errors.identifier && (
                <p className="text-xs text-error font-medium">{errors.identifier.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground" htmlFor="password">
                كلمة المرور
              </label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                error={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-error font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <RememberMe {...register('rememberMe')} />
              <Link
                href={AUTH_ROUTES.FORGOT_PASSWORD}
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" loading={isLoading}>
              تسجيل الدخول
            </Button>
          </form>

          <AuthFooter
            question="ليس لديك حساب؟"
            actionText="إنشاء حساب جديد"
            actionHref={AUTH_ROUTES.CHOOSE_ACCOUNT}
          />
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
