
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';

interface Order {
  id: string;
  order_number?: string;
  customer_email: string;
  image_count: number;
  total_price: number;
  status: string;
  created_at: string;
  packages?: {
    name: string;
    description: string;
  };
  order_images?: Array<{
    id: string;
    file_name: string;
    file_size: number;
  }>;
}

interface OrdersTableProps {
  orders: Order[];
  onOrderSelect: (orderId: string) => void;
}

const OrdersTable = ({ orders, onOrderSelect }: OrdersTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Ausstehend', variant: 'secondary' as const },
      processing: { label: 'In Bearbeitung', variant: 'default' as const },
      ready: { label: 'Bereit', variant: 'outline' as const },
      completed: { label: 'Abgeschlossen', variant: 'default' as const },
      cancelled: { label: 'Storniert', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: 'secondary' as const 
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Noch keine Bestellungen vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2 font-medium">Bestellnummer</th>
            <th className="text-left py-3 px-2 font-medium">Datum</th>
            <th className="text-left py-3 px-2 font-medium">Paket</th>
            <th className="text-left py-3 px-2 font-medium">Bilder</th>
            <th className="text-left py-3 px-2 font-medium">Preis</th>
            <th className="text-left py-3 px-2 font-medium">Status</th>
            <th className="text-left py-3 px-2 font-medium">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2">
                <span className="font-mono text-sm">
                  {order.order_number || `#${order.id.slice(0, 8)}`}
                </span>
              </td>
              <td className="py-3 px-2">
                {formatDate(order.created_at)}
              </td>
              <td className="py-3 px-2">
                {order.packages?.name || 'Unbekannt'}
              </td>
              <td className="py-3 px-2">
                {order.order_images?.length || order.image_count || 0}
              </td>
              <td className="py-3 px-2 font-medium">
                {formatPrice(order.total_price)}
              </td>
              <td className="py-3 px-2">
                {getStatusBadge(order.status)}
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOrderSelect(order.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status === 'completed' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
