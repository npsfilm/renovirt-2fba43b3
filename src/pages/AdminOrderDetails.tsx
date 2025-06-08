
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminOrderDetails = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bestellung #{orderId}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Details für Bestellung {orderId}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderDetails;
