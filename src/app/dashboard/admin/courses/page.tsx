import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminCoursesPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الكورسات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة الكورسات</p>
        </CardContent>
      </Card>
    </div>
  );
}
