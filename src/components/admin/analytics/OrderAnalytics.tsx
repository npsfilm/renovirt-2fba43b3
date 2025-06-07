import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';

const OrderAnalytics = () => {
  // Fetch order statistics with real-time updates
  const { data: stats, isLoading } = useQuery({
    queryKey: ['order-analytics'],
    queryFn: async () => {
      // Get total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_price')
        .not('total_price', 'is', null);

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price.toString()), 0) || 0;

      // Get customer count
      const { count: customerCount } = await supabase
        .from('customer_profiles')
        .select('*', { count: 'exact', head: true });

      // Get status distribution
      const { data: statusData } = await supabase
        .from('orders')
        .select('status');

      const statusCounts = statusData?.reduce((acc, order) => {
        const status = order.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get monthly orders (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: monthlyData } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .gte('created_at', sixMonthsAgo.toISOString());

      const monthlyOrders = monthlyData?.reduce((acc, order) => {
        const month = new Date(order.created_at).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
        acc[month] = {
          month,
          orders: (acc[month]?.orders || 0) + 1,
          revenue: (acc[month]?.revenue || 0) + parseFloat(order.total_price?.toString() || '0')
        };
        return acc;
      }, {} as Record<string, { month: string; orders: number; revenue: number }>) || {};

      return {
        totalOrders: totalOrders || 0,
        totalRevenue,
        customerCount: customerCount || 0,
        avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
        statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        })),
        monthlyOrders: Object.values(monthlyOrders),
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });

  const statusColors = {
    pending: 'hsl(var(--status-pending))',
    processing: 'hsl(var(--status-processing))', 
    quality_check: 'hsl(var(--status-quality-check))',
    revision: 'hsl(var(--status-revision))',
    completed: 'hsl(var(--status-completed))',
    delivered: 'hsl(var(--status-delivered))',
    cancelled: 'hsl(var(--status-cancelled))',
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-info" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Gesamtbestellungen</p>
                <p className="text-2xl font-bold text-foreground">{stats?.totalOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Gesamtumsatz</p>
                <p className="text-2xl font-bold text-foreground">€{stats?.totalRevenue.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Kunden</p>
                <p className="text-2xl font-bold text-foreground">{stats?.customerCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ø Bestellwert</p>
                <p className="text-2xl font-bold text-foreground">€{stats?.avgOrderValue.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bestellungen pro Monat</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.monthlyOrders || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status-Verteilung</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="hsl(var(--chart-1))"
                  dataKey="count"
                >
                  {stats?.statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.status as keyof typeof statusColors] || 'hsl(var(--chart-1))'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderAnalytics;
