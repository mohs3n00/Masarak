import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminReportsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">التقارير</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">تقارير المنصة</p>
        </CardContent>
      </Card>
    </div>
  );
}
