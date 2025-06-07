
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

      const totalProcessed = orders?.reduce((sum, order) => 
        sum + (order.image_count || 0), 0) || 0;

      return {
        activeOrders,
        completedThisWeek,
        totalProcessed
      };
    },
    enabled: !!user?.id,
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground leading-none">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-on-surface">
                    {stat.label}
                  </div>
                  <div className="text-xs text-subtle">
                    {stat.description}
                  </div>
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
