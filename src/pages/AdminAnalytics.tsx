
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import OrderAnalytics from '@/components/admin/analytics/OrderAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const AdminAnalytics = () => {
  // Echtzeit-Updates aktivieren
  useRealtimeOrders();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€12.450</div>
              <p className="text-xs text-muted-foreground">+20,1% zum Vormonat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bestellungen</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">+12% zum Vormonat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neue Kunden</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">+8% zum Vormonat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durchschnitt pro Bestellung</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€51</div>
              <p className="text-xs text-muted-foreground">+4% zum Vormonat</p>
            </CardContent>
          </Card>
        </div>

        {/* Diagramm-Bereich */}
        <OrderAnalytics />
      </main>
    </AdminLayout>
  );
};

export default AdminAnalytics;
