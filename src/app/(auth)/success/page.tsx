'use client';

import React from 'react';

import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { VerificationStatus } from '@/features/auth/components/VerificationStatus';

export default function SuccessPage() {
  return (
    <GuestGuard>
      <AuthLayout>
        <AuthCard>
          <VerificationStatus
            status="success"
            message="تم إنشاء حسابك وتأكيده بنجاح. يمكنك الآن تسجيل الدخول إلى منصة مسارك."
          />
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
