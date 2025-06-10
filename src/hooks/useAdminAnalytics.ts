
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Get total orders count
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_price')
        .eq('payment_status', 'paid')
        .not('total_price', 'is', null);

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price.toString()), 0) || 0;

      // Get new customers (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: newCustomers } = await supabase
        .from('customer_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate average order value
      const avgOrderValue = totalOrders && totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Get monthly revenue data (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: monthlyOrderData } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .eq('payment_status', 'paid')
        .gte('created_at', sixMonthsAgo.toISOString())
        .not('total_price', 'is', null);

      // Group by month
      const monthlyRevenue = monthlyOrderData?.reduce((acc, order) => {
        const month = new Date(order.created_at).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { month, revenue: 0, orders: 0 };
        }
        acc[month].revenue += parseFloat(order.total_price.toString());
        acc[month].orders += 1;
        return acc;
      }, {} as Record<string, { month: string; revenue: number; orders: number }>) || {};

      return {
        totalRevenue,
        totalOrders: totalOrders || 0,
        newCustomers: newCustomers || 0,
        avgOrderValue,
        monthlyRevenue: Object.values(monthlyRevenue),
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });
};
