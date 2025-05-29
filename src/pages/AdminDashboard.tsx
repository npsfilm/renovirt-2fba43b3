
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, ShoppingCart, TrendingUp, Euro } from 'lucide-react';

const AdminDashboard = () => {
  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [ordersResult, customersResult, revenueResult] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact' }),
        supabase.from('customer_profiles').select('*', { count: 'exact' }),
        supabase.from('orders').select('total_price'),
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => 
        sum + (parseFloat(order.total_price?.toString() || '0')), 0
      ) || 0;

      return {
        totalOrders: ordersResult.count || 0,
        totalCustomers: customersResult.count || 0,
        totalRevenue,
        pendingOrders: ordersResult.data?.filter(order => order.status === 'pending').length || 0,
      };
    },
  });

  return (
    <AdminLayout>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">
              Überblick über Ihre Plattform
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamte Bestellungen</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingOrders || 0} ausstehend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kunden</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registrierte Benutzer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">
                Gesamter Umsatz
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wachstum</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">
                Seit letztem Monat
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Letzte Aktivitäten</CardTitle>
              <CardDescription>
                Überblick über die neuesten Bestellungen und Kundenaktivitäten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Neue Bestellung #1234</p>
                    <p className="text-xs text-gray-500">vor 2 Stunden</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Kunde registriert</p>
                    <p className="text-xs text-gray-500">vor 4 Stunden</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bestellung abgeschlossen</p>
                    <p className="text-xs text-gray-500">vor 6 Stunden</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schnellzugriff</CardTitle>
              <CardDescription>
                Häufig verwendete Verwaltungsaufgaben
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <ShoppingCart className="w-6 h-6 text-blue-500 mb-2" />
                  <p className="text-sm font-medium">Bestellungen verwalten</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <Users className="w-6 h-6 text-green-500 mb-2" />
                  <p className="text-sm font-medium">Kunden verwalten</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
