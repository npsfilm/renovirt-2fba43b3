
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import OrdersOverview from '@/components/dashboard/OrdersOverview';
import { useRealTimeOrderUpdates } from '@/hooks/useRealTimeOrderUpdates';

const Orders = () => {
  // Enable real-time updates for order status changes
  useRealTimeOrderUpdates();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Meine Bestellungen</h1>
                <p className="text-sm text-gray-600">
                  Verwalten und verfolgen Sie alle Ihre Bestellungen
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <OrdersOverview />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Orders;
