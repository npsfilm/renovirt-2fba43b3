
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Edit } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

interface Order {
  id: string;
  customer_email: string;
  image_count: number;
  total_price: number;
  status: string;
  created_at: string;
  customer_profiles: {
    first_name: string;
    last_name: string;
    company?: string;
  } | null;
  order_images?: Array<{
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
  }>;
}

interface OrdersTableProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  onOrderSelect: (orderId: string) => void;
}

const OrdersTable = ({ orders, isLoading, onOrderSelect }: OrdersTableProps) => {
  if (isLoading) {
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bestellungen ({orders?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Bestell-ID</th>
                <th className="text-left py-3 px-4 font-medium">Kunde</th>
                <th className="text-left py-3 px-4 font-medium">E-Mail</th>
                <th className="text-left py-3 px-4 font-medium">Bilder</th>
                <th className="text-left py-3 px-4 font-medium">Betrag</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Datum</th>
                <th className="text-left py-3 px-4 font-medium">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs">
                      #{order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">
                        {order.customer_profiles?.first_name} {order.customer_profiles?.last_name}
                      </p>
                      {order.customer_profiles?.company && (
                        <p className="text-xs text-gray-500">{order.customer_profiles.company}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.customer_email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {order.order_images?.length || order.image_count || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    €{parseFloat(order.total_price?.toString() || '0').toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <OrderStatusBadge status={order.status || 'pending'} />
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('de-DE')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onOrderSelect(order.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    Keine Bestellungen gefunden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
