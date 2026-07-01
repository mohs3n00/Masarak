import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeachersIdPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">ملف المعلم</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">الملف العام للمعلم</p>
        </CardContent>
      </Card>
    </div>
  );
}
