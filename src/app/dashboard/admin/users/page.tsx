import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminUsersPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">المستخدمين</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة المستخدمين</p>
        </CardContent>
      </Card>
    </div>
  );
}
