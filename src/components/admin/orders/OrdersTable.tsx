
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderTableHeader from './table/OrderTableHeader';
import OrderTableRow from './table/OrderTableRow';
import OrderTableLoading from './table/OrderTableLoading';
import OrderTableEmpty from './table/OrderTableEmpty';
import { useOrderTableActions } from './table/OrderTableActions';

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
    storage_path: string;
  }>;
}

interface OrdersTableProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  onOrderSelect: (orderId: string) => void;
}

const OrdersTable = ({ orders, isLoading, onOrderSelect }: OrdersTableProps) => {
  const { handleDownloadAll, createOrderZip } = useOrderTableActions();

  if (isLoading) {
    return <OrderTableLoading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bestellungen ({orders?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <OrderTableHeader />
            <tbody>
              {orders?.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onOrderSelect={onOrderSelect}
                  onDownloadAll={handleDownloadAll}
                  onCreateZip={createOrderZip}
                />
              )) || <OrderTableEmpty />}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
