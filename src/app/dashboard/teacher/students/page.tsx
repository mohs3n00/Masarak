import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTeacherStudentsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الطلاب</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة الطلاب</p>
        </CardContent>
      </Card>
    </div>
  );
}
