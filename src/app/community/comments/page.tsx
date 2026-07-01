import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunityCommentsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">التعليقات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">إدارة التعليقات</p>
        </CardContent>
      </Card>
    </div>
  );
}
