
import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/layout/PageHeader';
import OrdersOverview from '@/components/dashboard/OrdersOverview';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import { useSearchParams } from 'react-router-dom';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { useIsMobile } from '@/hooks/use-mobile';

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Enable real-time updates
  useRealtimeOrders();

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

  const isMobile = useIsMobile();

  return (
    <MobileLayout>
      {!isMobile && (
        <PageHeader 
          title="Bestellungen" 
          subtitle="Übersicht über alle Ihre Bestellungen"
        />
      )}

      <div className="space-y-6 p-6">
        {isMobile && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Bestellungen</h1>
            <p className="text-muted-foreground">Übersicht über alle Ihre Bestellungen</p>
          </div>
        )}
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
