
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import OrderDetailsModal from '@/components/admin/orders/OrderDetailsModal';
import AdminMetrics from '@/components/admin/analytics/components/AdminMetrics';
import QuickInsights from '@/components/admin/dashboard/QuickInsights';
import PriorityOrdersTable from '@/components/admin/dashboard/PriorityOrdersTable';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const AdminDashboard = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Echtzeit-Updates für Administrator-Dashboard aktivieren
  useRealtimeOrders();

  const { data: analytics, isLoading } = useAdminAnalytics();

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  return (
    <AdminLayout>
      {/* Minimalistischer Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Überblick und Steuerung
            </p>
          </div>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="flex-1 p-6 bg-gray-50 space-y-6">
        {/* Quick Insights - Sofortige wichtige Informationen */}
        <QuickInsights />

        {/* Haupt-Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Linke Spalte - Prioritäts-Aufträge (2/3) */}
          <div className="lg:col-span-2">
            <PriorityOrdersTable onOrderSelect={handleOrderSelect} />
          </div>
          
          {/* Rechte Spalte - Kennzahlen (1/3) */}
          <div className="space-y-6">
            {/* Kompakte Kennzahlen */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-white rounded-lg border animate-pulse" />
                ))}
              </div>
            ) : analytics ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    €{analytics.totalRevenue.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Gesamtumsatz</div>
                </div>
                
                <div className="bg-white rounded-lg border p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.totalOrders}
                  </div>
                  <div className="text-sm text-gray-600">Bestellungen</div>
                </div>
                
                <div className="bg-white rounded-lg border p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    €{analytics.avgOrderValue.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Ø Bestellwert</div>
                </div>
                
                <div className="bg-white rounded-lg border p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {analytics.newCustomers}
                  </div>
                  <div className="text-sm text-gray-600">Neue Kunden</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          isOpen={!!selectedOrderId}
          onClose={handleCloseModal}
        />
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
