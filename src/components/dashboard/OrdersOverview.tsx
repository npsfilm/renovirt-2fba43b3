
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import OrdersTable from './OrdersTable';

interface OrdersOverviewProps {
  onOrderSelect: (orderId: string) => void;
}

const OrdersOverview = ({ onOrderSelect }: OrdersOverviewProps) => {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          packages (
            name,
            description
          ),
          order_images (
            id,
            file_name,
            file_size
          )
        `)
        .eq('user_id', user.id)
        .neq('payment_flow_status', 'draft') // Exclude draft orders
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meine Bestellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meine Bestellungen ({orders?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <OrdersTable orders={orders || []} onOrderSelect={onOrderSelect} />
      </CardContent>
    </Card>
  );
};

export default OrdersOverview;
