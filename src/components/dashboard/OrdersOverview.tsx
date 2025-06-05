
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import OrdersTable from './OrdersTable';
import OrdersSearchFilter from './OrdersSearchFilter';

interface OrdersOverviewProps {
  onOrderSelect: (orderId: string) => void;
}

const OrdersOverview = ({ onOrderSelect }: OrdersOverviewProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at_desc');

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
            file_size,
            file_type,
            storage_path
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

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];

    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        (order.order_number?.toLowerCase().includes(term)) ||
        (order.id.toLowerCase().includes(term)) ||
        (order.packages?.name?.toLowerCase().includes(term)) ||
        (order.status?.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'created_at_asc':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'created_at_desc':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'total_price_asc':
        filtered.sort((a, b) => parseFloat(a.total_price?.toString() || '0') - parseFloat(b.total_price?.toString() || '0'));
        break;
      case 'total_price_desc':
        filtered.sort((a, b) => parseFloat(b.total_price?.toString() || '0') - parseFloat(a.total_price?.toString() || '0'));
        break;
      case 'status':
        filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        break;
      default:
        break;
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

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
        <CardTitle>
          Meine Bestellungen ({filteredAndSortedOrders?.length || 0})
          {searchTerm && ` - Gefiltert von ${orders?.length || 0} Bestellungen`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrdersSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <OrdersTable orders={filteredAndSortedOrders || []} onOrderSelect={onOrderSelect} />
      </CardContent>
    </Card>
  );
};

export default OrdersOverview;
