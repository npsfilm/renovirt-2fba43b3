
import React, { useState, useEffect, useMemo } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/layout/PageHeader';
import OrdersOverview from '@/components/dashboard/OrdersOverview';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import OrderCardsMobile from '@/components/orders/OrderCardsMobile';
import OrderFiltersCompact from '@/components/orders/OrderFiltersCompact';
import MobileStatusBar from '@/components/dashboard/mobile/MobileStatusBar';
import { useSearchParams } from 'react-router-dom';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mobile filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at_desc');
  
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Enable real-time updates
  useRealtimeOrders();

  // Fetch orders for mobile view
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id, searchTerm],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_email,
          image_count,
          total_price,
          status,
          created_at,
          packages:package_id (
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
        .neq('status', 'draft');

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && isMobile,
    staleTime: searchTerm ? 0 : 5 * 60 * 1000,
  });

  // Filter and sort orders for mobile
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        (order.order_number && order.order_number.toLowerCase().includes(search)) ||
        order.customer_email?.toLowerCase().includes(search) ||
        order.packages?.name?.toLowerCase().includes(search) ||
        order.status?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_at_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'created_at_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'total_price_asc':
          return a.total_price - b.total_price;
        case 'total_price_desc':
          return b.total_price - a.total_price;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

  // Check for selected order in URL params
  useEffect(() => {
    const orderIdFromParams = searchParams.get('selected');
    if (orderIdFromParams) {
      setSelectedOrderId(orderIdFromParams);
      setIsModalOpen(true);
      // Remove the parameter from URL
      searchParams.delete('selected');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  if (isMobile) {
    return (
      <MobileLayout>
        {/* Mobile Status Bar */}
        <MobileStatusBar />
        
        {/* Mobile Content */}
        <div className="space-y-4">
          {/* Header */}
          <div className="pt-4 px-4">
            <h1 className="text-2xl font-semibold text-foreground">Bestellungen</h1>
            <p className="text-muted-foreground">Übersicht über alle Ihre Bestellungen</p>
          </div>

          {/* Filters */}
          <OrderFiltersCompact
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Orders Cards */}
          <div className="pb-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <OrderCardsMobile
                orders={filteredOrders}
                onOrderSelect={handleOrderSelect}
              />
            )}
          </div>
        </div>

        <OrderDetailsModal
          orderId={selectedOrderId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </MobileLayout>
    );
  }

  // Desktop layout
  return (
    <MobileLayout>
      <PageHeader 
        title="Bestellungen" 
        subtitle="Übersicht über alle Ihre Bestellungen"
      />

      <div className="space-y-6 p-6">
        <OrdersOverview onOrderSelect={handleOrderSelect} />
      </div>

      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </MobileLayout>
  );
};

export default Orders;
