import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTeacherAnnouncementsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الإعلانات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إعلانات للطلاب</p>
        </CardContent>
      </Card>
    </div>
  );
}
