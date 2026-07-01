import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTeacherCoursesPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">كورساتي</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة كورساتك</p>
        </CardContent>
      </Card>
    </div>
  );
}
