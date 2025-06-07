
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const IntelligentStats = () => {
  const { user } = useAuth();

  const { data: workflowData } = useQuery({
    queryKey: ['workflow-stats', user?.id],
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

      const completedThisWeek = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return order.status === 'completed' && orderDate > weekAgo;
      }).length || 0;

      const totalProcessed = orders?.reduce((sum, order) => sum + (order.image_count || 0), 0) || 0;

      return {
        activeOrders,
        completedThisWeek,
        totalProcessed
      };
    },
    enabled: !!user?.id
  });

  const stats = [
    {
      label: "Aktive Projekte",
      value: workflowData?.activeOrders || 0,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "in Bearbeitung"
    },
    {
      label: "Diese Woche",
      value: workflowData?.completedThisWeek || 0,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      description: "abgeschlossen"
    },
    {
      label: "Bilder verarbeitet",
      value: workflowData?.totalProcessed || 0,
      icon: Image,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "insgesamt"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-md aspect-[3/2]">
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-baseline gap-3 mb-1">
                  <div className="text-2xl font-bold text-foreground leading-none">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-on-surface leading-none">
                    {stat.label}
                  </div>
                </div>
                <div className="text-xs text-subtle">
                  {stat.description}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default IntelligentStats;
