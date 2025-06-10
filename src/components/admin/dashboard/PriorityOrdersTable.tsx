
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Filter } from 'lucide-react';
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

interface PriorityOrdersTableProps {
  onOrderSelect: (orderId: string) => void;
  activeFilter?: string;
}

const PriorityOrdersTable = ({ onOrderSelect, activeFilter }: PriorityOrdersTableProps) => {
  const [localFilter, setLocalFilter] = useState<string>('all');

  const currentFilter = activeFilter || localFilter;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['priority-orders', currentFilter],
    queryFn: async (): Promise<PriorityOrder[]> => {
      let query = supabase
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
        .neq('payment_flow_status', 'draft');

      // Apply filters based on currentFilter
      switch (currentFilter) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          query = query.gte('created_at', today.toISOString());
          break;
        case 'urgent':
          query = query.in('status', ['revision', 'pending']);
          break;
        case 'overdue':
          const twoDaysAgo = new Date();
          twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
          query = query
            .not('status', 'in', '(completed,delivered,cancelled)')
            .lt('created_at', twoDaysAgo.toISOString());
          break;
        case 'revenue':
          query = query.eq('payment_status', 'paid');
          break;
        default:
          query = query.in('status', ['pending', 'processing', 'quality_check', 'revision']);
          break;
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(15);

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

  const getFilterTitle = () => {
    switch (currentFilter) {
      case 'today': return 'Heutige Aufträge';
      case 'urgent': return 'Dringende Aufträge';
      case 'overdue': return 'Überfällige Aufträge';
      case 'revenue': return 'Bezahlte Aufträge';
      default: return 'Aktuelle Aufträge';
    }
  };

  const getFilterDescription = () => {
    switch (currentFilter) {
      case 'today': return 'Alle heute eingegangenen Bestellungen';
      case 'urgent': return 'Aufträge die sofortige Bearbeitung benötigen';
      case 'overdue': return 'Aufträge älter als 48 Stunden';
      case 'revenue': return 'Erfolgreich bezahlte Bestellungen';
      default: return 'Nach Dringlichkeit sortiert';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">{getFilterTitle()}</CardTitle>
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
          {getFilterTitle()}
          <Badge variant="secondary" className="ml-2">
            {orders?.length || 0}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">{getFilterDescription()}</p>
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
              <p>Keine Aufträge in dieser Kategorie</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityOrdersTable;
