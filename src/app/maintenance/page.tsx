import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MaintenancePage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">صيانة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">الموقع تحت الصيانة</p>
        </CardContent>
      </Card>
    </div>
  );
}
