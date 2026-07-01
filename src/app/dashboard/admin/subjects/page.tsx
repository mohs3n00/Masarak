import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminSubjectsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">المواد الدراسية</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة المواد</p>
        </CardContent>
      </Card>
    </div>
  );
}
