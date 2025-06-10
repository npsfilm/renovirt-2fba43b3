
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import OrderStatusBadge from '../orders/OrderStatusBadge';

interface PriorityOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  customer_email: string;
  total_price: number;
  image_count: number;
  created_at: string;
  estimated_completion: string | null;
  customer_profiles: {
    first_name: string;
    last_name: string;
    company?: string;
  } | null;
}

const PriorityOrdersTable = ({ onOrderSelect }: { onOrderSelect: (orderId: string) => void }) => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['priority-orders'],
    queryFn: async (): Promise<PriorityOrder[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          payment_status,
          customer_email,
          total_price,
          image_count,
          created_at,
          estimated_completion,
          customer_profiles!fk_orders_customer_profiles (
            first_name,
            last_name,
            company
          )
        `)
        .neq('payment_flow_status', 'draft')
        .in('status', ['pending', 'processing', 'quality_check', 'revision'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  const getPriorityIcon = (status: string, createdAt: string) => {
    const hoursOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    
    if (status === 'revision' || hoursOld > 48) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    if (hoursOld > 24) {
      return <Clock className="w-4 h-4 text-orange-500" />;
    }
    if (status === 'processing') {
      return <TrendingUp className="w-4 h-4 text-blue-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-gray-400" />;
  };

  const formatCustomerName = (order: PriorityOrder) => {
    if (order.customer_profiles) {
      const { first_name, last_name, company } = order.customer_profiles;
      return company || `${first_name || ''} ${last_name || ''}`.trim() || order.customer_email;
    }
    return order.customer_email;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Aktuelle Aufträge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Aktuelle Aufträge
          <Badge variant="secondary" className="ml-2">
            {orders?.length || 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {orders?.map((order) => (
            <div
              key={order.id}
              onClick={() => onOrderSelect(order.id)}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-transparent hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {getPriorityIcon(order.status, order.created_at)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium">
                      #{order.order_number || order.id.slice(0, 8)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {formatCustomerName(order)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-sm font-medium">
                    {order.image_count} Bilder
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div className="text-sm font-semibold">
                  €{parseFloat(order.total_price.toString()).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          
          {(!orders || orders.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Alle Aufträge sind bearbeitet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityOrdersTable;
