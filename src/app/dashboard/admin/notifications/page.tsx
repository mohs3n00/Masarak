import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminNotificationsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الإشعارات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إشعارات النظام</p>
        </CardContent>
      </Card>
    </div>
  );
}
