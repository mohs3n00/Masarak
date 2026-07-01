import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardAdminCategoriesPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">التصنيفات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة التصنيفات</p>
        </CardContent>
      </Card>
    </div>
  );
}
