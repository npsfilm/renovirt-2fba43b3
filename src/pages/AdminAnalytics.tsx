
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import OrderAnalytics from '@/components/admin/analytics/OrderAnalytics';
import AdminMetrics from '@/components/admin/analytics/components/AdminMetrics';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const AdminAnalytics = () => {
  // Echtzeit-Updates aktivieren
  useRealtimeOrders();

  const { data: analytics, isLoading } = useAdminAnalytics();

  return (
    <AdminLayout>
      {/* Kopfzeile */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Analytik</h1>
            <p className="text-sm text-muted-foreground">
              Detaillierte Einblicke in Geschäftsdaten und Trends
            </p>
          </div>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="flex-1 p-6 space-y-6 bg-background">
        {/* Wichtige Kennzahlen */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : analytics ? (
          <AdminMetrics
            totalRevenue={analytics.totalRevenue}
            totalOrders={analytics.totalOrders}
            newCustomers={analytics.newCustomers}
            avgOrderValue={analytics.avgOrderValue}
          />
        ) : null}

        {/* Diagramm-Bereich */}
        <OrderAnalytics />
      </main>
    </AdminLayout>
  );
};

export default AdminAnalytics;
