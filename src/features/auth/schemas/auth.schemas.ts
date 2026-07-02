import { z } from 'zod';

const phoneRegex = /^01[0125][0-9]{8}$/;

export const loginSchema = z.object({
  phone: z.string().regex(phoneRegex, { message: 'رقم هاتف مصري غير صالح' }),
  password: z.string().min(8, { message: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }),
  rememberMe: z.boolean().optional(),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const studentRegisterSchema = z
  .object({
    firstName: z.string().min(2, { message: 'الاسم الأول يجب أن يتكون من حرفين على الأقل' }),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    familyName: z.string().min(2, { message: 'الاسم الأخير يجب أن يتكون من حرفين على الأقل' }),
    phone: z.string().regex(phoneRegex, { message: 'رقم هاتف مصري غير صالح' }),
    parentPhone: z.string().regex(phoneRegex, { message: 'رقم هاتف ولي أمر مصري غير صالح' }).optional().or(z.literal('')),
    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }).optional().or(z.literal('')),
    password: z.string().min(8, { message: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }),
    confirmPassword: z.string(),
    country: z.string().optional(),
    governorate: z.string().optional(),
    city: z.string().optional(),
    grade: z.string().optional(),
    track: z.string().optional(),
    school: z.string().optional(),
    avatar: z.string().optional(),
    termsAccepted: z.literal(true, {
      message: 'يجب الموافقة على الشروط والأحكام'
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  });

export type StudentRegisterFormData = z.infer<typeof studentRegisterSchema>;

export const teacherRegisterSchema = z
  .object({
    name: z.string().min(2, { message: 'الاسم يجب أن يتكون من حرفين على الأقل' }),
    phone: z.string().regex(phoneRegex, { message: 'رقم هاتف مصري غير صالح' }),
    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }).optional().or(z.literal('')),
    password: z.string().min(8, { message: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }),
    confirmPassword: z.string(),
    nationalId: z.string().regex(/^\d{14}$/, { message: 'الرقم القومي يجب أن يتكون من 14 رقماً' }),
    biography: z.string().optional(),
    subjects: z.array(z.string()).optional(),
    experience: z.number().min(0).optional(),
    avatar: z.string().optional(),
    termsAccepted: z.literal(true, {
      message: 'يجب الموافقة على الشروط والأحكام والاقرار بصحة البيانات'
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  })
  .refine((data) => {
    // Basic Egyptian National ID validation for Age >= 21
    if (!/^\d{14}$/.test(data.nationalId)) return false;
    const century = parseInt(data.nationalId.charAt(0));
    const year = parseInt(data.nationalId.substring(1, 3));
    const month = parseInt(data.nationalId.substring(3, 5));
    const day = parseInt(data.nationalId.substring(5, 7));
    const fullYear = (century === 2 ? 1900 : 2000) + year;
    const dateOfBirth = new Date(fullYear, month - 1, day);
    
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const m = today.getMonth() - dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age >= 21;
  }, {
    message: 'يجب أن يكون العمر 21 عاماً على الأقل للتدريس',
    path: ['nationalId'],
  });

export type TeacherRegisterFormData = z.infer<typeof teacherRegisterSchema>;

export const forgotPasswordSchema = z.object({
  phone: z.string().regex(phoneRegex, { message: 'رقم هاتف مصري غير صالح' }),
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

export const verifyPhoneSchema = z.object({
  code: z.string().length(6, { message: 'رمز التحقق يجب أن يكون 6 أرقام' }),
});
export type VerifyPhoneFormData = z.infer<typeof verifyPhoneSchema>;
