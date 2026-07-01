import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">غير مصرح</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">ليس لديك صلاحية</p>
        </CardContent>
      </Card>
    </div>
  );
}
