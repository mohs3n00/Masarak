'use client';

import React from 'react';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { StudentRegistrationWizard } from '@/features/auth/components/wizard/StudentRegistrationWizard';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';

export default function StudentRegisterPage() {
  return (
    <GuestGuard>
      <AuthLayout illustration="/images/auth/student-illustration.png">
        <AuthCard>
          <StudentRegistrationWizard />
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
