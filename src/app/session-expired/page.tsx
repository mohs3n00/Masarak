'use client';

import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { buttonVariants } from '@/shared/components/atoms/Button';
import { AUTH_ROUTES } from '@/features/auth/constants/auth.constants';

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-6">
        <Clock className="h-8 w-8 text-warning" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">انتهت الجلسة</h1>
      <p className="text-base text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
        عذراً، لقد انتهت صلاحية الجلسة الخاصة بك لدواعي الأمان. يرجى تسجيل الدخول مرة أخرى للمتابعة.
      </p>
      <Link href={AUTH_ROUTES.LOGIN} className={buttonVariants({ size: "lg" })}>
        تسجيل الدخول
      </Link>
    </div>
  );
}
