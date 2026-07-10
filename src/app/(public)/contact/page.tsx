import React from 'react';
import { AppContainer } from '@/shared/layouts/Containers';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

import { ContactForm } from '@/features/marketing/components/forms/ContactForm';

export const metadata = {
  title: 'اتصل بنا | مسارك',
  description: 'تواصل مع فريق الدعم الفني لمسارك لحل أي مشكلة تواجهك.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <AppContainer>
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl font-black text-foreground tracking-tight">
              تواصل معنا
            </h1>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              فريق الدعم الفني موجود لمساعدتك في أي وقت. لا تتردد في التواصل معنا لأي استفسار أو مشكلة تواجهك.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Info Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">معلومات التواصل</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">رقم الهاتف / واتساب</h3>
                    <p className="text-text-muted mt-1" dir="ltr">+20 100 000 0000</p>
                    <p className="text-sm text-text-muted mt-1">متاح يومياً من 10 صباحاً إلى 10 مساءً</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">البريد الإلكتروني</h3>
                    <p className="text-text-muted mt-1" dir="ltr">support@masarak.com</p>
                    <p className="text-sm text-text-muted mt-1">نرد خلال 24 ساعة عمل</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">مقر الشركة</h3>
                    <p className="text-text-muted mt-1">القاهرة، جمهورية مصر العربية</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 border border-border mt-8">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h4 className="font-bold text-foreground">مواعيد العمل</h4>
                </div>
                <p className="text-text-muted text-sm leading-relaxed">
                  نحن نعمل طوال أيام الأسبوع لتوفير أفضل دعم ممكن للطلاب والمعلمين. 
                  الدعم الفني متاح عبر الواتساب والمحادثة الفورية لسرعة الاستجابة.
                </p>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">أرسل لنا رسالة</h2>
              <ContactForm />
            </div>

          </div>
        </div>
      </AppContainer>
    </div>
  );
}
