import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminMediaPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">مكتبة الوسائط</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">الملفات المرفوعة</p>
        </CardContent>
      </Card>
    </div>
  );
}
