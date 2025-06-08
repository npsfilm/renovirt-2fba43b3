
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminAddons = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Addon-Verwaltung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier können Sie Addons verwalten.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAddons;
