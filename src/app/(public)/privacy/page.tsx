import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'سياسة الخصوصية وحذف الحساب | منصة مسارك',
  description: 'سياسة الخصوصية وتعليمات طلب حذف الحساب والبيانات لمنصة وتطبيق مسارك التعليمي (Masarak)',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-2">سياسة الخصوصية وحماية البيانات</h1>
      <p className="text-sm text-text-secondary mb-8">
        تطبيق ومنصة <strong>مسارك (Masarak)</strong> | تاريخ التحديث: يوليو 2026
      </p>
      
      <div className="prose prose-lg dark:prose-invert space-y-8">
        <p className="text-xl text-text-secondary leading-relaxed">
          نحن في منصة وتطبيق <strong>مسارك (Masarak)</strong> نلتزم بأعلى معايير حماية الخصوصية والشفافية في التعامل مع بياناتك الشخصية. تشرح هذه السياسة كيفية جمع بياناتك، استخدامها، وحقك التام في التحكم بها أو طلب حذف الحساب والبيانات المرتبطة به وفقاً لسياسات متجر <strong>Google Play</strong>.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. ما هي البيانات التي نجمعها؟</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li><strong>بيانات الهوية والحساب:</strong> الاسم الكامل، البريد الإلكتروني، ورقم الهاتف عند التسجيل.</li>
            <li><strong>بيانات النشاط والأداء التعليمي:</strong> الكورسات المسجل بها، نسبة التقدم، نتائج الاختبارات، والتواجد على المنصة.</li>
            <li><strong>البيانات التقنية:</strong> معلومات الجهاز، نظام التشغيل، وعنوان IP لغرض تحسين الأداء والأمان.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">2. كيف نستخدم هذه البيانات؟</h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>تقديم الخدمات التعليمية وإتاحة المحتوى الدراسي ومتابعة تقدم الطالب.</li>
            <li>إرسال الإشعارات والتحديثات الهامة الخاصة بالحساب والكورسات.</li>
            <li>تحسين وتطوير تجربة المستخدم وجودة منصة وتطبيق مسارك.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">3. مشاركة البيانات</h2>
          <p className="text-text-secondary leading-relaxed">
            نحن لا نبيع أو نشارك بياناتك الشخصية مع أي أطراف خارجية لأغراض تسويقية. يتم مشاركة بعض البيانات الضرورية فقط مع المعلمين (مثل الاسم) ليتعرفوا على طلابهم داخل الكورسات.
          </p>
        </section>

        {/* Google Play Policy Section: Account & Data Deletion */}
        <section id="delete-account" className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6 my-10">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xl shrink-0">
              ✕
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground m-0">4. طلب حذف الحساب والبيانات (Account & Data Deletion)</h2>
              <p className="text-sm text-text-secondary m-0">إرشادات الشفافية المطلوبة لبطاقة بيانات التطبيق على متجر Google Play</p>
            </div>
          </div>

          <p className="text-text-secondary leading-relaxed">
            يحق لك في أي وقت طلب حذف حسابك الشخصي وجميع البيانات المرتبطة به على منصة وتطبيق <strong>مسارك (Masarak)</strong>.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground mb-2">خطوات تقديم طلب حذف الحساب:</h3>
            
            <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
              <h4 className="font-bold text-foreground mb-2">الطريقة الأولى: من داخل التطبيق</h4>
              <ol className="list-decimal list-inside text-text-secondary text-sm space-y-1">
                <li>افتح تطبيق <strong>مسارك (Masarak)</strong> على هاتفك وسجّل الدخول.</li>
                <li>توجه إلى قائمة <strong>الملف الشخصي</strong> أو <strong>الإعدادات</strong>.</li>
                <li>اختر <strong>إعدادات الحساب</strong> ثم اضغط على <strong>طلب حذف الحساب</strong>.</li>
                <li>أكّد طلب الحذف وسيتم معالجة الطلب فوراً.</li>
              </ol>
            </div>

            <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
              <h4 className="font-bold text-foreground mb-2">الطريقة الثانية: طلب الحذف عبر الويب (رابط مباشر)</h4>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                إذا تعذر عليك فتح التطبيق أو رغبت في طلب حذف الحساب والبيانات عبر المتصفح، يمكنك إرسال الطلب مباشرة عبر نموذج التواصل:
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-destructive text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-destructive/90 transition-colors shadow-sm"
              >
                رابط طلب حذف الحساب والبيانات
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-xl font-semibold text-foreground mb-2">حذف البيانات دون حذف الحساب (حذف جزئي):</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              توفر منصة مسارك خيار التحكم الجزئي بالبيانات، حيث يمكنك طلب حذف بيانات محددة (مثل: سجل التقدم في كورس معين، نتائج اختبار، أو الصورة الشخصية) دون الحاجة لحذف الحساب بالكامل. يمكنك تقديم الطلب عبر خيار التواصل بالأسفل.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-medium text-sm border border-border hover:bg-secondary/80 transition-colors"
            >
              طلب حذف بيانات محددة فقط
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/60">
            <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
              <h4 className="font-bold text-destructive text-base mb-2">البيانات التي يتم حذفها نهائياً:</h4>
              <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                <li>معلومات Profile (الاسم، البريد الإلكتروني، رقم الهاتف).</li>
                <li>الصورة الشخصية وإعدادات الحساب.</li>
                <li>سجل الكورسات المسجلة والتقدم الدراسي ونتائج الاختبارات.</li>
                <li>سجل التفاعلات والرسائل والتعليقات.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h4 className="font-bold text-amber-600 dark:text-amber-400 text-base mb-2">البيانات التي يتم الاحتفاظ بها ومدة الاحتفاظ:</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                قد يتم الاحتفاظ بالسجلات المالية والفواتير الخاصة بعمليات الشراء لمدة تصل إلى <strong>90 يوماً</strong> كحد أقصى (أو حسب الفترة القانونية المحددة) لغرض الامتثال الضريبي والمالي والقانوني، ثم تُحذف نهائياً بعد ذلك.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">5. أمان البيانات</h2>
          <p className="text-text-secondary leading-relaxed">
            نحن نستخدم أحدث تقنيات التشفير والحماية لضمان أمان بياناتك الشخصية وحسابك على المنصة، ومنع أي وصول غير مصرح به.
          </p>
        </section>

        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mt-12">
          <h3 className="font-bold text-primary mb-2">للاستفسار والدعم الفني</h3>
          <p className="text-text-secondary">
            إذا كانت لديك أي مخاوف أو أسئلة حول الخصوصية أو كيفية تعاملنا مع بياناتك، يمكنك مراسلتنا في أي وقت عبر <Link href="/contact" className="text-primary font-medium hover:underline">صفحة التواصل</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

