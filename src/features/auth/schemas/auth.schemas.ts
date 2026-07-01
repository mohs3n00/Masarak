import { z } from 'zod';
import { AUTH_ROLES } from '../constants/auth.constants';

export const loginSchema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  password: z.string().min(8, { message: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }),
  rememberMe: z.boolean().optional(),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'الاسم يجب أن يتكون من حرفين على الأقل' }),
    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
    password: z.string().min(8, { message: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }),
    confirmPassword: z.string(),
    role: z.enum([AUTH_ROLES.STUDENT, AUTH_ROLES.TEACHER] as const, {
      message: 'يجب اختيار نوع الحساب'
    }),
    termsAccepted: z.literal(true, {
      error: 'يجب الموافقة على الشروط والأحكام'
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  code: z.string().length(6, { message: 'رمز التحقق يجب أن يكون 6 أرقام' }),
});
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
