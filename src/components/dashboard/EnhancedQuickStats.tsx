
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const EnhancedQuickStats = () => {
  const { user } = useAuth();

  const { data: orderStats } = useQuery({
    queryKey: ['enhanced-user-order-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, image_count, created_at')
        .eq('user_id', user.id)
        .neq('payment_flow_status', 'draft');

      if (error) throw error;

      const activeOrders = orders?.filter(order => 
        order.status === 'pending' || order.status === 'processing'
      ).length || 0;

      const completedOrders = orders?.filter(order => 
        order.status === 'completed'
      ).length || 0;

      const totalOrders = orders?.length || 0;

      // Calculate images this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const imagesThisMonth = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === currentMonth && 
               orderDate.getFullYear() === currentYear;
      }).reduce((sum, order) => sum + (order.image_count || 0), 0) || 0;

      return {
        activeOrders,
        completedOrders,
        totalOrders,
        imagesThisMonth
      };
    },
    enabled: !!user?.id,
  });

  const stats = [
    {
      title: "Aktive Bestellungen",
      value: orderStats?.activeOrders?.toString() || "0",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "Abgeschlossen",
      value: orderStats?.completedOrders?.toString() || "0",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Gesamtbestellungen",
      value: orderStats?.totalOrders?.toString() || "0",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Bilder diesen Monat",
      value: orderStats?.imagesThisMonth?.toString() || "0",
      icon: Image,
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground leading-none">{stat.value}</p>
                  <p className="text-sm font-medium text-on-surface leading-tight">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedQuickStats;
