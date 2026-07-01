import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTeacherCoursesCreatePage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">بناء كورس جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إضافة كورس جديد</p>
        </CardContent>
      </Card>
    </div>
  );
}
