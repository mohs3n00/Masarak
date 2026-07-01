import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ComingSoonPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">قريباً</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">هذه الميزة قريباً</p>
        </CardContent>
      </Card>
    </div>
  );
}
