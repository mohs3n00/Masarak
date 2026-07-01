import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminAuditPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">سجل النظام</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Audit Logs</p>
        </CardContent>
      </Card>
    </div>
  );
}
