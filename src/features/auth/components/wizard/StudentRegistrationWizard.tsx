'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { studentRegisterSchema, StudentRegisterFormData } from '@/features/auth/schemas/auth.schemas';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { PROTECTED_ROUTES } from '@/features/auth/constants/auth.constants';
import { ApiError } from '@/shared/api/error.models';
import { AuthWizard } from './AuthWizard';
import { Input, PasswordInput } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Common Select Component (Native) for simple usage
const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
>(({ className, error, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground",
        "transition-colors duration-200 outline-none appearance-none cursor-pointer",
        "focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:border-primary",
        error 
          ? "border-error focus:ring-error focus:border-error" 
          : "border-input-border hover:border-border-strong",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
NativeSelect.displayName = "NativeSelect";

const GOVERNORATES = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية"];
const GRADES = ["الصف الأول الثانوي", "الصف الثاني الثانوي", "الصف الثالث الثانوي"];

export function StudentRegistrationWizard() {
  const router = useRouter();
  const { setLoading, setError, isLoading, error } = useAuthStore();
  
  const [step, setStep] = useState<number>(0); // 0: Personal, 1: Academic

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<StudentRegisterFormData>({
    resolver: zodResolver(studentRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      termsAccepted: true
    }
  });

  const onSubmit = async (data: StudentRegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.registerStudent(data);
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

  const handleNextStep = async () => {
    // Validate Step 0 fields before proceeding
    const fieldsToValidate: (keyof StudentRegisterFormData)[] = [
      'firstName', 'middleName', 'lastName', 'familyName',
      'phone', 'parentPhone', 'password', 'confirmPassword'
    ];
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(1);
    }
  };

  return (
    <AuthWizard
      currentStep={step}
      totalSteps={2}
      title="إنشاء حساب طالب"
      description={step === 0 ? "أدخل بياناتك الشخصية للبدء" : "أكمل بياناتك الدراسية"}
    >
      {error && (
        <div className="mb-6 p-3 bg-error/10 text-error text-sm font-medium rounded-lg border border-error/20 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* STEP 0: Personal Info */}
        <div className={cn("flex-col gap-5", step === 0 ? "flex" : "hidden")}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">الاسم الأول</label>
              <Input placeholder="أحمد" error={!!errors.firstName} {...register('firstName')} />
              {errors.firstName && <p className="text-xs text-error font-medium">{errors.firstName.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">الاسم الثاني</label>
              <Input placeholder="محمد" error={!!errors.middleName} {...register('middleName')} />
              {errors.middleName && <p className="text-xs text-error font-medium">{errors.middleName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">الاسم الثالث</label>
              <Input placeholder="محمود" error={!!errors.lastName} {...register('lastName')} />
              {errors.lastName && <p className="text-xs text-error font-medium">{errors.lastName.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">الاسم الأخير</label>
              <Input placeholder="علي" error={!!errors.familyName} {...register('familyName')} />
              {errors.familyName && <p className="text-xs text-error font-medium">{errors.familyName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">رقم الهاتف</label>
              <Input type="tel" dir="ltr" placeholder="01xxxxxxxxx" error={!!errors.phone} {...register('phone')} />
              {errors.phone && <p className="text-xs text-error font-medium text-end">{errors.phone.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">رقم ولي الأمر</label>
              <Input type="tel" dir="ltr" placeholder="01xxxxxxxxx" error={!!errors.parentPhone} {...register('parentPhone')} />
              {errors.parentPhone && <p className="text-xs text-error font-medium text-end">{errors.parentPhone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">كلمة المرور</label>
              <PasswordInput placeholder="••••••••" error={!!errors.password} {...register('password')} />
              {errors.password && <p className="text-xs text-error font-medium">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">تأكيد كلمة المرور</label>
              <PasswordInput placeholder="••••••••" error={!!errors.confirmPassword} {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-error font-medium">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <Button type="button" size="lg" className="w-full mt-4" onClick={handleNextStep}>
            التالي
          </Button>
        </div>

        {/* STEP 1: Academic Info */}
        <div className={cn("flex-col gap-5", step === 1 ? "flex" : "hidden")}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">المحافظة</label>
            <NativeSelect error={!!errors.governorate} {...register('governorate')}>
              <option value="">اختر المحافظة</option>
              {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
            </NativeSelect>
            {errors.governorate && <p className="text-xs text-error font-medium">{errors.governorate.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">الإدارة التعليمية</label>
            <Input placeholder="مثال: إدارة الدقي التعليمية" error={!!errors.city} {...register('city')} />
            {errors.city && <p className="text-xs text-error font-medium">{errors.city.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">السنة الدراسية</label>
            <NativeSelect error={!!errors.grade} {...register('grade')}>
              <option value="">اختر السنة الدراسية</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </NativeSelect>
            {errors.grade && <p className="text-xs text-error font-medium">{errors.grade.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">كود الدعوة</label>
            <Input placeholder="أدخل كود الدعوة (مدرس أو إدارة)" error={!!errors.invitationCode} {...register('invitationCode')} />
            {errors.invitationCode && <p className="text-xs text-error font-medium">{errors.invitationCode.message}</p>}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button type="button" variant="outline" size="lg" className="w-1/3" onClick={() => setStep(0)}>
              رجوع
            </Button>
            <Button type="submit" size="lg" className="flex-1" loading={isLoading}>
              إنشاء الحساب
            </Button>
          </div>
        </div>

      </form>
    </AuthWizard>
  );
}
