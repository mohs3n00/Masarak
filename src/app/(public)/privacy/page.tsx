import React from 'react';

export const metadata = {
  title: 'سياسة الخصوصية | منصة مسارك',
  description: 'سياسة الخصوصية لمنصة مسارك التعليمية',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-8">سياسة الخصوصية</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <p className="text-xl text-text-secondary mb-8">
          نحن في منصة مسارك نأخذ خصوصيتك بجدية تامة. هذه السياسة تشرح لك ببساطة كيف نتعامل مع بياناتك.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. ما هي البيانات التي نجمعها؟</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>البيانات الأساسية عند التسجيل (الاسم، رقم الهاتف، البريد الإلكتروني).</li>
            <li>بيانات نشاطك على المنصة (الكورسات التي تدرسها وتقدمك فيها).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">2. كيف نستخدم هذه البيانات؟</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>لتوفير تجربة تعليمية مخصصة لك.</li>
            <li>للتواصل معك بخصوص تحديثات الكورسات أو الإشعارات الهامة.</li>
            <li>لتحسين جودة المنصة وخدماتها بشكل مستمر.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">3. هل نشارك بياناتك؟</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>لا نبيع أو نشارك بياناتك الشخصية مع أي أطراف خارجية لأغراض تسويقية.</li>
            <li>تتم مشاركة بعض البيانات الضرورية فقط مع المعلمين (مثل اسمك ليتعرفوا على طلابهم).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">4. أمان البيانات</h2>
          <p className="text-text-secondary leading-relaxed">
            نحن نستخدم أحدث تقنيات التشفير والحماية لضمان أمان بياناتك الشخصية وحسابك على المنصة، ومنع أي وصول غير مصرح به.
          </p>
        </section>

        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mt-12">
          <h3 className="font-bold text-primary mb-2">للاستفسار عن الخصوصية</h3>
          <p className="text-text-secondary">
            إذا كانت لديك أي مخاوف أو أسئلة حول كيفية تعاملنا مع بياناتك، يمكنك مراسلتنا عبر <a href="/contact" className="text-primary hover:underline">صفحة التواصل</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
