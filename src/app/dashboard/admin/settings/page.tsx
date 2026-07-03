import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, PlusCircle, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

async function getRawSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/settings/homepage`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function DashboardAdminSettingsPage() {
  const data = await getRawSettings();
  const isEmpty = !data || data.length === 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">إعدادات المنصة</h1>
          <p className="text-muted-foreground mt-2">تحكم في محتوى الصفحة الرئيسية وإعدادات النظام.</p>
        </div>
      </div>

      {isEmpty ? (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">لم يتم إعداد الصفحة الرئيسية</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              يبدو أن قاعدة البيانات فارغة حالياً. الزوار يرون الآن المحتوى الافتراضي. يمكنك إما تشغيل `npm run prisma:seed` لإنشاء الإعدادات الأولية أو إضافتها يدوياً.
            </p>
            <Button size="lg" className="gap-2">
              <PlusCircle className="w-5 h-5" />
              إضافة قسم (Hero Section)
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              تكوين الصفحة الرئيسية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.map((item: any) => (
                <div key={item.id} className="p-4 border rounded-lg bg-surface flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{item.section}</h3>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                  </div>
                  <Button variant="outline">تعديل</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
