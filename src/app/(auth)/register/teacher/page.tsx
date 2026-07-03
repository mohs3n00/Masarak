'use client';

import React from 'react';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { TeacherRegistrationWizard } from '@/features/auth/components/wizard/TeacherRegistrationWizard';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';

import signUpImage from '@/assets/images/sign up.png';

export default function TeacherRegisterPage() {
  return (
    <GuestGuard>
      <AuthLayout 
        title="أهلاً بك معلّمنا القدير"
        subtitle="انضم إلى نخبة المعلمين وشارك علمك مع آلاف الطلاب."
        illustration={signUpImage}
      >
        <AuthCard>
          <TeacherRegistrationWizard />
          <div className="mt-6">
            <AuthFooter
              question="لديك حساب بالفعل؟"
              actionText="تسجيل الدخول"
              actionHref={AUTH_ROUTES.LOGIN}
            />
          </div>
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
