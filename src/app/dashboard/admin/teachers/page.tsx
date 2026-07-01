import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminTeachersPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">المعلمين</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة المعلمين</p>
        </CardContent>
      </Card>
    </div>
  );
}
