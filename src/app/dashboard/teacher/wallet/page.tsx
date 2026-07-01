import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTeacherWalletPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">المحفظة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">رصيدك</p>
        </CardContent>
      </Card>
    </div>
  );
}
