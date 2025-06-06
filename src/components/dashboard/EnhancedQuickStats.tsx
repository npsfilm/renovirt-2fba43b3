
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
      color: "text-muted",
      bgColor: "bg-muted-background"
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
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.title}</p>
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
