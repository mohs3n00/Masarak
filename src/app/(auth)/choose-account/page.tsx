'use client';

import React from 'react';
import Link from 'next/link';
import { AUTH_ROUTES, AUTH_ROLES } from '@/features/auth/constants/auth.constants';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { AuthFooter } from '@/features/auth/components/AuthFooter';
import { BookOpen, GraduationCap } from 'lucide-react';

export default function ChooseAccountPage() {
  return (
    <GuestGuard>
      <AuthLayout>
        <AuthCard>
          <AuthHeader
            title="إنشاء حساب جديد"
            description="اختر نوع الحساب الذي ترغب في إنشائه للمتابعة."
          />

          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/register/student"
              className="flex items-center gap-4 p-4 border border-border/60 rounded-xl hover:border-primary/50 hover:bg-primary/[0.03] transition-all duration-200 group"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">طالب</h3>
                <p className="text-sm text-muted-foreground mt-0.5">أريد تصفح الدورات والتعلم</p>
              </div>
            </Link>

            <Link
              href="/register/teacher"
              className="flex items-center gap-4 p-4 border border-border/60 rounded-xl hover:border-primary/50 hover:bg-primary/[0.03] transition-all duration-200 group"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">معلم</h3>
                <p className="text-sm text-muted-foreground mt-0.5">أريد نشر دوراتي والتدريس</p>
              </div>
            </Link>
          </div>

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
