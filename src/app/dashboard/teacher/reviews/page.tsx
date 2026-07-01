import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardTeacherReviewsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">التقييمات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">آراء الطلاب</p>
        </CardContent>
      </Card>
    </div>
  );
}
