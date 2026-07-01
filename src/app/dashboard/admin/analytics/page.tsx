import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminAnalyticsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">التحليلات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">تحليلات المنصة</p>
        </CardContent>
      </Card>
    </div>
  );
}
