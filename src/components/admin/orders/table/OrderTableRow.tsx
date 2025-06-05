
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Download, Archive } from 'lucide-react';
import OrderStatusBadge from '../OrderStatusBadge';

interface Order {
  id: string;
  order_number?: string;
  customer_email: string;
  image_count: number;
  total_price: number;
  status: string;
  payment_status?: string;
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
    storage_path: string;
  }>;
  packages?: {
    name: string;
  } | null;
}

interface OrderTableRowProps {
  order: Order;
  onOrderSelect: (orderId: string) => void;
  onDownloadAll: (order: Order) => void;
  onCreateZip: (order: Order) => void;
}

const OrderTableRow = ({ order, onOrderSelect, onDownloadAll, onCreateZip }: OrderTableRowProps) => {
  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (!paymentStatus) return null;
    
    const statusConfig = {
      pending: { label: 'Ausstehend', className: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Bezahlt', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Fehlgeschlagen', className: 'bg-red-100 text-red-800' },
      refunded: { label: 'Erstattet', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[paymentStatus as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span className={`px-2 py-1 rounded text-xs ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div>
          <span className="font-mono text-sm font-medium">
            {order.order_number || `#${order.id.slice(0, 8)}`}
          </span>
          <p className="text-xs text-gray-500">{order.packages?.name}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <div>
          <p className="font-medium">
            {order.customer_profiles?.first_name} {order.customer_profiles?.last_name}
          </p>
          {order.customer_profiles?.company && (
            <p className="text-xs text-gray-500">{order.customer_profiles.company}</p>
          )}
          <p className="text-xs text-gray-600">{order.customer_email}</p>
        </div>
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
        <div className="space-y-1">
          <OrderStatusBadge status={order.status || 'pending'} />
          {getPaymentStatusBadge(order.payment_status)}
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        {new Date(order.created_at).toLocaleDateString('de-DE')}
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onOrderSelect(order.id)}
            title="Bestellung bearbeiten"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDownloadAll(order)}
            title="Alle Dateien herunterladen"
            disabled={!order.order_images || order.order_images.length === 0}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onCreateZip(order)}
            title="ZIP-Archiv erstellen"
            disabled={!order.order_images || order.order_images.length === 0}
          >
            <Archive className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;
