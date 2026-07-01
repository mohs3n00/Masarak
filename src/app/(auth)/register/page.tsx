'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerSchema, RegisterFormData } from '@/features/auth/schemas/auth.schemas';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { authService } from '@/features/auth/services/auth.service';
import { AUTH_ROUTES, AUTH_ROLES, PROTECTED_ROUTES } from '@/features/auth/constants/auth.constants';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { PasswordInput, Input } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { TermsCheckbox } from '@/features/auth/components/TermsCheckbox';
import { SocialButtons } from '@/features/auth/components/SocialButtons';
import { ApiError } from '@/shared/api/error.models';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRole = searchParams.get('role');

  const { setAuth, setLoading, setError, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: (urlRole === AUTH_ROLES.TEACHER || urlRole === AUTH_ROLES.STUDENT) ? urlRole : AUTH_ROLES.STUDENT,
    },
  });

  // If no role is selected, redirect to choose account
  useEffect(() => {
    if (!urlRole || (urlRole !== AUTH_ROLES.TEACHER && urlRole !== AUTH_ROLES.STUDENT)) {
      router.replace(AUTH_ROUTES.CHOOSE_ACCOUNT);
    } else {
      setValue('role', urlRole as 'STUDENT' | 'TEACHER');
    }
  }, [urlRole, router, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      setAuth(response.user, response.tokens);
      router.push(PROTECTED_ROUTES.DASHBOARD);
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

  const title = urlRole === AUTH_ROLES.TEACHER ? 'حساب معلم جديد' : 'حساب طالب جديد';

  return (
    <GuestGuard>
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title={title}
            description="أنشئ حسابك الآن وابدأ رحلتك التعليمية مع مسارك."
          />

          {error && (
            <div className="mb-4 p-3 bg-error/8 text-error text-sm rounded-xl border border-error/20 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground" htmlFor="name">
                الاسم الكامل
              </label>
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسمك الكامل"
                error={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-error font-medium">{errors.name.message}</p>
              )}
            </div>

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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground" htmlFor="confirmPassword">
                تأكيد كلمة المرور
              </label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                error={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-error font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-1">
              <TermsCheckbox
                {...register('termsAccepted')}
                error={errors.termsAccepted?.message}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" loading={isLoading}>
              إنشاء الحساب
            </Button>
          </form>

          <SocialButtons />

          <AuthFooter
            question="لديك حساب بالفعل؟"
            actionText="تسجيل الدخول"
            actionHref={AUTH_ROUTES.LOGIN}
          />
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
