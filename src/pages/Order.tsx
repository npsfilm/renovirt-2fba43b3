
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Order = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Neue Bestellung</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hier können Sie eine neue Bestellung aufgeben.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Order;
