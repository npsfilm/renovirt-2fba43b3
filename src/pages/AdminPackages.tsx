
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPackages = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Paket-Verwaltung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier können Sie Pakete verwalten.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPackages;
