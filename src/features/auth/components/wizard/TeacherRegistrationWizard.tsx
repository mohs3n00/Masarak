'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { teacherRegisterSchema, TeacherRegisterFormData } from '@/features/auth/schemas/auth.schemas';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/features/auth/constants/auth.constants';
import { ApiError } from '@/shared/api/error.models';
import { AuthWizard } from './AuthWizard';
import { Input, PasswordInput } from '@/shared/components/atoms/Input';
import { PasswordStrength } from '@/shared/components/atoms/PasswordStrength';
import { Button } from '@/shared/components/atoms/Button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/shared/components/atoms/Textarea';

import { apiClient } from '@/shared/api/api.client';

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

export function TeacherRegistrationWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading, setError, isLoading, error } = useAuthStore();
  
  const [step, setStep] = useState<number>(0); // 0: Personal, 1: Professional
  const [dbSubjects, setDbSubjects] = useState<{id: string, name: string}[]>([]);

  React.useEffect(() => {
    apiClient.get('/academic/subjects').then((res) => {
      setDbSubjects(res.data.items || res.data || []);
    }).catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setError: setFormError,
    formState: { errors },
  } = useForm<TeacherRegisterFormData>({
    resolver: zodResolver(teacherRegisterSchema),
    mode: 'onTouched',
    defaultValues: {
      termsAccepted: true
    }
  });

  const passwordValue = watch('password');
  const formData = watch();

  const onSubmit = async (data: TeacherRegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authService.registerTeacher(data);
      const redirectParam = searchParams.get('redirect');
      const loginUrl = redirectParam ? `${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectParam)}` : AUTH_ROUTES.LOGIN;
      router.push(loginUrl);
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
    const fieldsToValidate: (keyof TeacherRegisterFormData)[] = [
      'name', 'email', 'phone', 'password', 'confirmPassword'
    ];
    
    const isStepValid = await trigger(fieldsToValidate);
    const pwd = watch('password');
    const cpwd = watch('confirmPassword');
    
    if (isStepValid) {
      if (pwd !== cpwd) {
        setFormError('confirmPassword', { type: 'manual', message: 'كلمات المرور غير متطابقة' });
        return;
      }
      setStep(1);
    }
  };

  return (
    <AuthWizard
      currentStep={step}
      totalSteps={2}
      title="إنشاء حساب معلم"
      description={step === 0 ? "أدخل بياناتك الشخصية للبدء" : "أكمل بياناتك المهنية"}
    >
      {error && (
        <div className="mb-6 p-3 bg-error/10 text-error text-sm font-medium rounded-lg border border-error/20 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* STEP 0: Personal Info */}
        <div className={cn("flex-col gap-5", step === 0 ? "flex" : "hidden")}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">الاسم الرباعي</label>
            <Input placeholder="أحمد محمد محمود علي" error={!!errors.name} {...register('name')} />
            {errors.name && <p className="text-xs text-error font-medium">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">البريد الإلكتروني</label>
            <Input type="email" dir="ltr" placeholder="teacher@example.com" error={!!errors.email} {...register('email')} />
            {errors.email && <p className="text-xs text-error font-medium text-end">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">رقم الهاتف</label>
            <Input type="tel" dir="ltr" placeholder="01xxxxxxxxx" error={!!errors.phone} {...register('phone')} />
            {errors.phone && <p className="text-xs text-error font-medium text-end">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">كلمة المرور</label>
              <PasswordInput placeholder="••••••••" error={!!errors.password} {...register('password')} />
              <PasswordStrength password={passwordValue} />
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

        {/* STEP 1: Professional Info */}
        <div className={cn("flex-col gap-5", step === 1 ? "flex" : "hidden")}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">الرقم القومي (14 رقم)</label>
            <Input type="text" dir="ltr" placeholder="29001011234567" error={!!errors.nationalId} {...register('nationalId')} />
            {errors.nationalId && <p className="text-xs text-error font-medium text-end">{errors.nationalId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">المادة الأساسية</label>
              {/* Using native select for simplicity, mapped to first subject array item */}
              <NativeSelect 
                error={!!errors.subjectIds} 
                onChange={(e) => {
                  const val = e.target.value;
                  const subjectIds = val ? [val] : [];
                  register('subjectIds').onChange({ target: { name: 'subjectIds', value: subjectIds } });
                }}
              >
                <option value="">اختر المادة</option>
                {dbSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </NativeSelect>
              {errors.subjectIds && <p className="text-xs text-error font-medium">{errors.subjectIds.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">سنوات الخبرة</label>
              <Input type="number" min="0" placeholder="مثال: 5" error={!!errors.experience} {...register('experience', { valueAsNumber: true })} />
              {errors.experience && <p className="text-xs text-error font-medium">{errors.experience.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground">نبذة عنك (اختياري)</label>
            <Textarea 
              placeholder="اكتب نبذة مختصرة عن مسيرتك المهنية وطريقة تدريسك..." 
              className="resize-none h-24"
              error={!!errors.biography} 
              {...register('biography')} 
            />
            {errors.biography && <p className="text-xs text-error font-medium">{errors.biography.message}</p>}
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
