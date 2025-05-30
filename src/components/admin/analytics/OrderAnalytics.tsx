
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';

const OrderAnalytics = () => {
  // Fetch order statistics
  const { data: stats } = useQuery({
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
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString());

      const monthlyOrders = monthlyData?.reduce((acc, order) => {
        const month = new Date(order.created_at).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        totalOrders: totalOrders || 0,
        totalRevenue,
        customerCount: customerCount || 0,
        avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
        statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count,
        })),
        monthlyOrders: Object.entries(monthlyOrders).map(([month, count]) => ({
          month,
          orders: count,
        })),
      };
    },
  });

  const statusColors = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    ready_for_review: '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444',
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gesamtbestellungen</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gesamtumsatz</p>
                <p className="text-2xl font-bold text-gray-900">€{stats?.totalRevenue.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kunden</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.customerCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ø Bestellwert</p>
                <p className="text-2xl font-bold text-gray-900">€{stats?.avgOrderValue.toFixed(2) || '0.00'}</p>
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
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
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats?.statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.status as keyof typeof statusColors] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderAnalytics;
