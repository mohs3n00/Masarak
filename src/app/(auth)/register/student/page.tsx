'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { studentRegisterSchema, StudentRegisterFormData } from '@/features/auth/schemas/auth.schemas';
import { authService } from '@/features/auth/services/auth.service';
import { PROTECTED_ROUTES } from '@/features/auth/constants/auth.constants';
import { GuestGuard } from '@/features/auth/components/guards/GuestGuard';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { Input, PasswordInput } from '@/shared/components/atoms/Input';
import { Button } from '@/shared/components/atoms/Button';
import { AvatarUploader } from '@/shared/components/uploaders/AvatarUploader';
import { TermsCheckbox } from '@/features/auth/components/TermsCheckbox';
import { ApiError } from '@/shared/api/error.models';

const steps = ['المعلومات الشخصية', 'المعلومات الأكاديمية', 'حماية الحساب'];

export default function StudentRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, trigger, formState: { errors }, setValue } = useForm<StudentRegisterFormData>({
    resolver: zodResolver(studentRegisterSchema),
    mode: 'onChange',
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['firstName', 'middleName', 'lastName', 'familyName', 'phone', 'parentPhone'];
    if (currentStep === 1) fieldsToValidate = ['governorate', 'city', 'grade', 'track', 'school'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data: StudentRegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.registerStudent(data);
      // In a real flow, redirect to OTP verification. For now, go to dashboard or login
      router.push(PROTECTED_ROUTES.DASHBOARD);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <AuthLayout illustration="/images/auth/student-illustration.png" title="تسجيل كطالب">
        <AuthCard>
          <AuthHeader
            title="إنشاء حساب طالب"
            description="انضم إلى مسارك وابدأ رحلتك التعليمية الآن."
          />

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 h-1 bg-muted rounded-full top-1/2 -translate-y-1/2 -z-10" />
            <div 
              className="absolute right-0 h-1 bg-primary rounded-full top-1/2 -translate-y-1/2 -z-10 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((label, index) => (
              <div key={label} className="flex flex-col items-center gap-2 bg-card px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  index <= currentStep ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-card text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-xs ${index <= currentStep ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{label}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/8 text-error text-sm rounded-xl border border-error/20 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 overflow-hidden">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">الاسم الأول</label>
                      <Input placeholder="أحمد" error={!!errors.firstName} {...register('firstName')} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">الاسم الثاني (اختياري)</label>
                      <Input placeholder="محمد" error={!!errors.middleName} {...register('middleName')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">الاسم الثالث (اختياري)</label>
                      <Input placeholder="علي" error={!!errors.lastName} {...register('lastName')} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">اسم العائلة</label>
                      <Input placeholder="محمود" error={!!errors.familyName} {...register('familyName')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">رقم الهاتف (أساسي)</label>
                      <Input type="tel" placeholder="01xxxxxxxxx" error={!!errors.phone} {...register('phone')} />
                      {errors.phone && <p className="text-xs text-error font-medium">{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">رقم ولي الأمر</label>
                      <Input type="tel" placeholder="01xxxxxxxxx" error={!!errors.parentPhone} {...register('parentPhone')} />
                      {errors.parentPhone && <p className="text-xs text-error font-medium">{errors.parentPhone.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">المحافظة</label>
                      <Input placeholder="مثال: القاهرة" error={!!errors.governorate} {...register('governorate')} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">المركز / المدينة</label>
                      <Input placeholder="مثال: مدينة نصر" error={!!errors.city} {...register('city')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">الصف الدراسي</label>
                      <Input placeholder="مثال: الثالث الثانوي" error={!!errors.grade} {...register('grade')} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">الشعبة</label>
                      <select 
                        {...register('track')} 
                        className="bg-card border-2 border-border/50 rounded-xl px-4 h-[52px] text-sm font-medium focus:outline-none focus:border-primary w-full"
                      >
                        <option value="">اختر الشعبة</option>
                        <option value="علمي علوم">علمي علوم</option>
                        <option value="علمي رياضة">علمي رياضة</option>
                        <option value="أدبي">أدبي</option>
                        <option value="عام">عام (للصف الأول والثاني)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">المدرسة (اختياري)</label>
                    <Input placeholder="اسم المدرسة" error={!!errors.school} {...register('school')} />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <label className="text-sm font-bold">الصورة الشخصية (اختياري)</label>
                    <div className="w-32 h-32">
                      <AvatarUploader onUploadSuccess={(data) => setValue('avatar', data.url)} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">البريد الإلكتروني (اختياري)</label>
                    <Input type="email" placeholder="example@mail.com" error={!!errors.email} {...register('email')} />
                    {errors.email && <p className="text-xs text-error font-medium">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">كلمة المرور</label>
                      <PasswordInput placeholder="••••••••" error={!!errors.password} {...register('password')} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">تأكيد كلمة المرور</label>
                      <PasswordInput placeholder="••••••••" error={!!errors.confirmPassword} {...register('confirmPassword')} />
                    </div>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-error font-medium">{errors.confirmPassword.message}</p>}

                  <div className="mt-4">
                    <TermsCheckbox {...register('termsAccepted')} />
                    {errors.termsAccepted && <p className="text-xs text-error font-medium mt-1">{errors.termsAccepted.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 mt-8">
              {currentStep > 0 && (
                <Button type="button" variant="outline" size="lg" className="flex-1" onClick={prevStep} disabled={loading}>
                  السابق
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" size="lg" className="flex-1" onClick={nextStep}>
                  التالي
                </Button>
              ) : (
                <Button type="submit" size="lg" className="flex-1" loading={loading}>
                  إنشاء الحساب
                </Button>
              )}
            </div>
          </form>
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
