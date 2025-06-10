
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAnalytics = (timeFilter: string = '30days') => {
  return useQuery({
    queryKey: ['admin-analytics', timeFilter],
    queryFn: async () => {
      // Calculate date range based on filter
      const now = new Date();
      let startDate = new Date();
      
      switch (timeFilter) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '3months':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case '12months':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'all':
        default:
          startDate = new Date(2020, 0, 1); // Start from 2020
          break;
      }

      // Get total orders count within date range
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get total revenue within date range
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_price')
        .eq('payment_status', 'paid')
        .gte('created_at', startDate.toISOString())
        .not('total_price', 'is', null);

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price.toString()), 0) || 0;

      // Get new customers within date range
      const { count: newCustomers } = await supabase
        .from('customer_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Calculate average order value
      const avgOrderValue = totalOrders && totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Get time-based revenue data (adjusted based on filter)
      const { data: timeBasedOrderData } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .eq('payment_status', 'paid')
        .gte('created_at', startDate.toISOString())
        .not('total_price', 'is', null);

      // Group by appropriate time period
      const timeGrouping = timeFilter === '7days' ? 'day' : 
                          timeFilter === '30days' ? 'day' :
                          timeFilter === '3months' ? 'week' : 'month';

      const monthlyRevenue = timeBasedOrderData?.reduce((acc, order) => {
        let period = '';
        const date = new Date(order.created_at);
        
        if (timeGrouping === 'day') {
          period = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
        } else if (timeGrouping === 'week') {
          // Get week number
          const weekNumber = Math.ceil(date.getDate() / 7);
          period = `W${weekNumber} ${date.toLocaleDateString('de-DE', { month: 'short' })}`;
        } else {
          period = date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
        }
        
        if (!acc[period]) {
          acc[period] = { month: period, revenue: 0, orders: 0 };
        }
        acc[period].revenue += parseFloat(order.total_price.toString());
        acc[period].orders += 1;
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
