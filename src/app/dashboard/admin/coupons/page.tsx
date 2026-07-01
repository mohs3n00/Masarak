import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminCouponsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الكوبونات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">الخصومات</p>
        </CardContent>
      </Card>
    </div>
  );
}
