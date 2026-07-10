import { z } from 'zod';

const phoneRegex = /^01[0125][0-9]{8}$/;

export const loginSchema = z.object({
  identifier: z.string().regex(phoneRegex, { message: 'رقم هاتف مصري غير صالح' }),
  password: z.string().min(8, { message: 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل' }),
  rememberMe: z.boolean().optional(),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const studentRegisterSchema = z
  .object({
    email: z.string().email({ message: 'بريد إلكتروني غير صالح' }),
    firstName: z.string().min(2, { message: 'الاسم الأول مطلوب' }),
    middleName: z.string().min(2, { message: 'الاسم الثاني مطلوب' }),
    lastName: z.string().min(2, { message: 'الاسم الثالث مطلوب' }),
    familyName: z.string().min(2, { message: 'الاسم الأخير مطلوب' }),
    phone: z.string().regex(phoneRegex, { message: 'رقم هاتف غير صالح' }),
    parentPhone: z.string().regex(phoneRegex, { message: 'رقم ولي الأمر غير صالح' }),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[\x21-\x7E]{8,}$/, { message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف إنجليزي ورقم، ولا يُسمح بالحروف العربية.' }),
    confirmPassword: z.string(),
    governorate: z.string().min(2, { message: 'المحافظة مطلوبة' }),
    city: z.string().min(2, { message: 'الإدارة التعليمية مطلوبة' }),
    grade: z.string().min(1, { message: 'السنة الدراسية مطلوبة' }),
    avatar: z.string().optional(),

    termsAccepted: z.literal(true, {
      message: 'يجب الموافقة على الشروط والأحكام'
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword'],
  })
  .refine((data) => data.phone !== data.parentPhone, {
    message: 'رقم الهاتف ورقم ولي الأمر لا يمكن أن يكونا متطابقين',
    path: ['parentPhone'],
  });

export type StudentRegisterFormData = z.infer<typeof studentRegisterSchema>;

export const teacherRegisterSchema = z
  .object({
    name: z.string().min(2, { message: 'الاسم يجب أن يتكون من حرفين على الأقل' }),
    email: z.string().email({ message: 'بريد إلكتروني غير صالح' }),
    phone: z.string().regex(phoneRegex, { message: 'رقم هاتف مصري غير صالح' }),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[\x21-\x7E]{8,}$/, { message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف إنجليزي ورقم، ولا يُسمح بالحروف العربية.' }),
    confirmPassword: z.string(),
    nationalId: z.string().regex(/^\d{14}$/, { message: 'الرقم القومي يجب أن يتكون من 14 رقماً' }),
    biography: z.string().optional(),
    subjectIds: z.array(z.string()).optional(),
    levelIds: z.array(z.string()).optional(),
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
  email: z.string().email({ message: 'بريد إلكتروني غير صالح' }),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[\x21-\x7E]{8,}$/, { message: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل، وتحتوي على حرف إنجليزي ورقم، ولا يُسمح بالحروف العربية.' }),
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
