
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderTableLoading = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bestellungen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Bestellungen...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTableLoading;
