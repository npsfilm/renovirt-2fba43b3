import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Package, Clock, CheckCircle, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const QuickStatsCards = () => {
  const { user } = useAuth();

  const { data: orderStats, isLoading } = useQuery({
    queryKey: ['mobile-order-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, created_at, image_count')
        .eq('user_id', user.id)
        .neq('payment_status', 'draft');

      if (error) throw error;

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const activeOrders = orders?.filter(order => 
        ['pending', 'processing', 'quality_check'].includes(order.status)
      ).length || 0;

      const completedThisMonth = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return order.status === 'completed' && orderDate >= thisMonth;
      }).length || 0;

      const totalImages = orders?.reduce((sum, order) => sum + (order.image_count || 0), 0) || 0;
      
      const imagesThisMonth = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= thisMonth;
      }).reduce((sum, order) => sum + (order.image_count || 0), 0) || 0;

      return {
        activeOrders,
        completedThisMonth,
        totalImages,
        imagesThisMonth,
        monthlyLimit: 500 // This could come from user profile/subscription
      };
    },
    enabled: !!user?.id,
  });

  const stats = [
    {
      id: 'active',
      label: 'Aktive Projekte',
      value: orderStats?.activeOrders || 0,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      showProgress: false,
    },
    {
      id: 'completed',
      label: 'Abgeschlossen',
      value: orderStats?.completedThisMonth || 0,
      sublabel: 'Diesen Monat',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      showProgress: false,
    },
    {
      id: 'quota',
      label: 'Upload Quota',
      value: orderStats?.imagesThisMonth || 0,
      max: orderStats?.monthlyLimit || 500,
      icon: Upload,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      showProgress: true,
    },
    {
      id: 'total',
      label: 'Bilder gesamt',
      value: orderStats?.totalImages || 0,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      showProgress: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 px-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="min-w-[140px] animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
      {stats.map((stat) => (
        <Card key={stat.id} className="min-w-[140px] bg-card/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.max && (
                  <span className="text-sm text-muted-foreground">
                    /{stat.max}
                  </span>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground font-medium leading-tight">
                {stat.label}
              </p>
              
              {stat.sublabel && (
                <p className="text-[10px] text-muted-foreground">
                  {stat.sublabel}
                </p>
              )}
              
              {stat.showProgress && stat.max && (
                <div className="mt-2">
                  <Progress 
                    value={(stat.value / stat.max) * 100} 
                    className="h-1.5"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsCards;