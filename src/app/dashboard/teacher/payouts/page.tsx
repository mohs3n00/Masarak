import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTeacherPayoutsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">السحوبات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">سحوبات الأرباح</p>
        </CardContent>
      </Card>
    </div>
  );
}
