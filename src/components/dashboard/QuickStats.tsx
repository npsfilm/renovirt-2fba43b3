
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const QuickStats = () => {
  const { user } = useAuth();

  const { data: orderStats } = useQuery({
    queryKey: ['user-order-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_price')
        .eq('user_id', user.id);

      if (error) throw error;

      const activeOrders = orders?.filter(order => 
        order.status === 'pending' || order.status === 'processing'
      ).length || 0;

      const completedOrders = orders?.filter(order => 
        order.status === 'completed'
      ).length || 0;

      const totalOrders = orders?.length || 0;

      const pendingPayment = orders?.filter(order => 
        order.status === 'payment_pending'
      ).reduce((sum, order) => sum + (parseFloat(order.total_price?.toString() || '0')), 0) || 0;

      return {
        activeOrders,
        completedOrders,
        totalOrders,
        pendingPayment: pendingPayment.toFixed(2)
      };
    },
    enabled: !!user?.id,
  });

  const stats = [
    {
      title: "Aktive Bestellungen",
      value: orderStats?.activeOrders?.toString() || "0",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Abgeschlossen",
      value: orderStats?.completedOrders?.toString() || "0",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Gesamt Bestellungen",
      value: orderStats?.totalOrders?.toString() || "0",
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Offene Rechnung",
      value: orderStats?.pendingPayment ? `€${orderStats.pendingPayment}` : "€0.00",
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
