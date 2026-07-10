'use client';

import React from 'react';
import { Button } from '@/shared/components/atoms/Button';
import { toast } from 'sonner';

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('تم إرسال رسالتك بنجاح. سيتم التواصل معك قريباً!');
    // Here you would typically send the data to the backend
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground">الاسم بالكامل</label>
        <input 
          type="text" 
          required
          placeholder="اكتب اسمك ثلاثي" 
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">رقم الهاتف</label>
          <input 
            type="tel" 
            required
            placeholder="01xxxxxxxxx" 
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-right"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">البريد الإلكتروني (اختياري)</label>
          <input 
            type="email" 
            placeholder="example@mail.com" 
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground">المشكلة أو الاستفسار</label>
        <select className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer">
          <option>مشكلة في التسجيل أو الدخول</option>
          <option>مشكلة في تفعيل كود خصم / اشتراك</option>
          <option>مشكلة في تشغيل الفيديوهات</option>
          <option>استفسار عام</option>
          <option>أخرى</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground">تفاصيل الرسالة</label>
        <textarea 
          required
          rows={4}
          placeholder="اشرح مشكلتك بالتفصيل عشان نقدر نساعدك بأسرع وقت..." 
          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
        />
      </div>

      <Button type="submit" className="w-full h-12 text-lg mt-2 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
        إرسال الرسالة
      </Button>
    </form>
  );
}
