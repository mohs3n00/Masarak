import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminSupportPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">تذاكر الدعم</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">الدعم الفني</p>
        </CardContent>
      </Card>
    </div>
  );
}
