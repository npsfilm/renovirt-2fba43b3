
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import OrdersOverview from '@/components/dashboard/OrdersOverview';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';
import { useSearchParams } from 'react-router-dom';

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Bestellungen" 
            subtitle="Übersicht über alle Ihre Bestellungen"
          />

          <main className="flex-1 space-y-6 p-6">
            <OrdersOverview onOrderSelect={handleOrderSelect} />
          </main>

          <OrderDetailsModal
            orderId={selectedOrderId}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Orders;
