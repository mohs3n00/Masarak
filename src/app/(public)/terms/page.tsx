import React from 'react';

export const metadata = {
  title: 'شروط الخدمة | منصة مسارك',
  description: 'شروط الخدمة لاستخدام منصة مسارك التعليمية',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-8">شروط الخدمة</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-text-secondary mb-8">
          أهلاً بك في منصة مسارك التعليمية. باستخدامك للمنصة، فإنك توافق على الشروط البسيطة التالية لضمان بيئة تعليمية صحية ومفيدة للجميع.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. الحساب الشخصي</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>حسابك شخصي ولا يجوز مشاركته مع أشخاص آخرين.</li>
            <li>أنت مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بك.</li>
            <li>يجب تقديم بيانات صحيحة ودقيقة عند التسجيل.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">2. المحتوى التعليمي</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>جميع الكورسات والمواد التعليمية مملوكة للمنصة وللمعلمين، ولا يُسمح بإعادة نشرها أو بيعها.</li>
            <li>يُمنع استخدام أي برامج لتسجيل أو تحميل الفيديوهات بطرق غير مصرح بها.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">3. السلوك العام</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>نرجو الالتزام بالاحترام المتبادل في التعليقات والمناقشات مع المعلمين والطلاب.</li>
            <li>يُمنع نشر أي محتوى مسيء أو غير لائق أو خارج عن الإطار التعليمي.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">4. المدفوعات والاسترجاع</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>يتم الدفع من خلال بوابات الدفع المعتمدة والآمنة.</li>
            <li>يمكن طلب استرجاع المبلغ خلال 14 يوماً من شراء الكورس إذا لم تتجاوز نسبة المشاهدة 10%.</li>
          </ul>
        </section>

        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mt-12">
          <h3 className="font-bold text-primary mb-2">تواصل معنا</h3>
          <p className="text-text-secondary">
            إذا كان لديك أي سؤال أو استفسار حول شروط الخدمة، لا تتردد في التواصل معنا عبر صفحة <a href="/contact" className="text-primary hover:underline">اتصل بنا</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
