import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunityTrendingPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">الشائع</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">المنشورات الشائعة</p>
        </CardContent>
      </Card>
    </div>
  );
}
