import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommunityFeedPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">المجتمع</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">المنشورات</p>
        </CardContent>
      </Card>
    </div>
  );
}
