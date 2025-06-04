
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import OrderAnalytics from '@/components/admin/analytics/OrderAnalytics';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const AdminDashboard = () => {
  // Enable real-time updates for admin dashboard
  useRealtimeOrders();

  return (
    <AdminLayout>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">
              Überblick über Bestellungen, Kunden und Umsätze
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <OrderAnalytics />
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
