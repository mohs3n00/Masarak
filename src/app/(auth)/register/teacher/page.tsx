'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { teacherRegisterSchema, TeacherRegisterFormData } from '@/features/auth/schemas/auth.schemas';
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

const steps = ['البيانات الأساسية', 'التحقق الذكي', 'المعلومات المهنية'];

export default function TeacherRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, trigger, formState: { errors }, setValue, watch } = useForm<TeacherRegisterFormData>({
    resolver: zodResolver(teacherRegisterSchema),
    mode: 'onChange',
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['name', 'phone', 'email', 'password', 'confirmPassword'];
    if (currentStep === 1) fieldsToValidate = ['nationalId'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data: TeacherRegisterFormData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.registerTeacher(data);
      // Wait for user to be pushed to dashboard or verification page
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

  const watchAll = watch();

  return (
    <GuestGuard>
      <AuthLayout illustration="/images/auth/teacher-illustration.png" title="تسجيل كمعلم">
        <AuthCard>
          <AuthHeader
            title="إنشاء حساب معلم"
            description="انضم إلى نخبة المعلمين في مسارك."
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
                <span className={`text-[10px] sm:text-xs ${index <= currentStep ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{label}</span>
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">الاسم الكامل المطابق للهوية</label>
                    <Input placeholder="الاسم الرباعي" error={!!errors.name} {...register('name')} />
                    {errors.name && <p className="text-xs text-error font-medium">{errors.name.message}</p>}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">رقم الهاتف (أساسي)</label>
                    <Input type="tel" placeholder="01xxxxxxxxx" error={!!errors.phone} {...register('phone')} />
                    {errors.phone && <p className="text-xs text-error font-medium">{errors.phone.message}</p>}
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
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mb-2">
                    <h4 className="font-bold text-primary mb-1">التحقق الذكي للهوية</h4>
                    <p className="text-xs text-muted-foreground">
                      سيتم التحقق من صحة الرقم القومي وتاريخ الميلاد وعمر المعلم بشكل آلي وآمن. يجب أن يكون العمر 21 عاماً على الأقل.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">الرقم القومي (14 رقم)</label>
                    <Input type="text" maxLength={14} placeholder="2901231..." error={!!errors.nationalId} {...register('nationalId')} />
                    {errors.nationalId && <p className="text-xs text-error font-medium">{errors.nationalId.message}</p>}
                  </div>

                  <div className="flex flex-col items-center gap-2 mt-4">
                    <label className="text-sm font-bold">الصورة الشخصية (اختياري)</label>
                    <div className="w-32 h-32">
                      <AvatarUploader onUploadSuccess={(data) => setValue('avatar', data.url)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">التخصص (المواد)</label>
                      <Input placeholder="مثال: رياضيات، فيزياء" onChange={(e) => setValue('subjects', e.target.value.split(','))} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold">سنوات الخبرة</label>
                      <Input type="number" min="0" placeholder="5" {...register('experience', { valueAsNumber: true })} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold">السيرة الذاتية المبسطة</label>
                    <Input placeholder="نبذة قصيرة عن خبراتك..." {...register('biography')} />
                  </div>

                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 mt-4">
                    <h4 className="font-bold text-primary mb-2">إقرار الهوية والصلاحية</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      أقر بأن جميع البيانات صحيحة ومطابقة للواقع، وأتحمل المسؤولية القانونية الكاملة في حال ثبوت عكس ذلك. وأدرك أنه سيتم مراجعة حسابي من قبل الإدارة قبل تفعيله كمعلم.
                    </p>
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
                  إرسال طلب الانضمام
                </Button>
              )}
            </div>
          </form>
        </AuthCard>
      </AuthLayout>
    </GuestGuard>
  );
}
