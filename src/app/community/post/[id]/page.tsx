import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunityPostIdPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">تفاصيل المنشور</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">عرض المنشور</p>
        </CardContent>
      </Card>
    </div>
  );
}
