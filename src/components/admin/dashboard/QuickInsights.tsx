
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, Clock, CheckCircle, Euro } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const QuickInsights = () => {
  const { data: insights, isLoading } = useQuery({
    queryKey: ['quick-insights'],
    queryFn: async () => {
      // Get today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get yesterday for comparison
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('total_price, payment_status')
        .gte('created_at', today.toISOString())
        .neq('payment_flow_status', 'draft');
      
      const { data: yesterdayOrders } = await supabase
        .from('orders')
        .select('total_price, payment_status')
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString())
        .neq('payment_flow_status', 'draft');
      
      // Get pending orders that need attention
      const { data: urgentOrders } = await supabase
        .from('orders')
        .select('id, status, created_at')
        .in('status', ['revision', 'pending'])
        .neq('payment_flow_status', 'draft');
      
      // Get overdue orders (>48h old and not completed)
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
      
      const { data: overdueOrders } = await supabase
        .from('orders')
        .select('id')
        .not('status', 'in', '(completed,delivered,cancelled)')
        .lt('created_at', twoDaysAgo.toISOString())
        .neq('payment_flow_status', 'draft');
      
      const todayRevenue = todayOrders?.reduce((sum, order) => 
        sum + (order.payment_status === 'paid' ? parseFloat(order.total_price.toString()) : 0), 0
      ) || 0;
      
      const yesterdayRevenue = yesterdayOrders?.reduce((sum, order) => 
        sum + (order.payment_status === 'paid' ? parseFloat(order.total_price.toString()) : 0), 0
      ) || 0;
      
      const revenueTrend = yesterdayRevenue > 0 
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 
        : 0;
      
      const revisionCount = urgentOrders?.filter(o => o.status === 'revision').length || 0;
      const pendingCount = urgentOrders?.filter(o => o.status === 'pending').length || 0;
      
      return {
        todayOrders: todayOrders?.length || 0,
        yesterdayOrders: yesterdayOrders?.length || 0,
        todayRevenue,
        revenueTrend,
        revisionCount,
        pendingCount,
        overdueCount: overdueOrders?.length || 0,
      };
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const ordersTrend = insights?.yesterdayOrders 
    ? ((insights.todayOrders - insights.yesterdayOrders) / insights.yesterdayOrders) * 100 
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Today's Orders */}
      <Card className="border border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {insights?.todayOrders || 0}
              </p>
              <p className="text-sm text-gray-600">Neue Aufträge</p>
            </div>
            <div className="flex flex-col items-end">
              <CheckCircle className="w-6 h-6 text-blue-500 mb-1" />
              {ordersTrend !== 0 && (
                <Badge variant={ordersTrend > 0 ? "default" : "secondary"} className="text-xs">
                  {ordersTrend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(ordersTrend).toFixed(0)}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Revenue */}
      <Card className="border border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                €{insights?.todayRevenue?.toFixed(0) || 0}
              </p>
              <p className="text-sm text-gray-600">Heutiger Umsatz</p>
            </div>
            <div className="flex flex-col items-end">
              <Euro className="w-6 h-6 text-green-500 mb-1" />
              {insights?.revenueTrend !== 0 && (
                <Badge variant={insights?.revenueTrend > 0 ? "default" : "secondary"} className="text-xs">
                  {insights?.revenueTrend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(insights?.revenueTrend).toFixed(0)}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Orders */}
      <Card className="border border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {(insights?.revisionCount || 0) + (insights?.pendingCount || 0)}
              </p>
              <p className="text-sm text-gray-600">Benötigen Aufmerksamkeit</p>
            </div>
            <div className="flex flex-col items-end">
              <Clock className="w-6 h-6 text-orange-500 mb-1" />
              {insights?.revisionCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {insights.revisionCount} Revision
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Orders */}
      <Card className="border border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">
                {insights?.overdueCount || 0}
              </p>
              <p className="text-sm text-gray-600">Überfällige Aufträge</p>
            </div>
            <div className="flex flex-col items-end">
              <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
              {insights?.overdueCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  >48h
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickInsights;
