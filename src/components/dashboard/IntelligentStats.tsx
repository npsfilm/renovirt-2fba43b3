
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Image, Zap } from 'lucide-react';
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

      // Calculate workflow efficiency (mock for now)
      const efficiency = Math.min(95, 70 + (completedThisWeek * 5));

      return {
        activeOrders,
        completedThisWeek,
        totalProcessed,
        efficiency
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
    },
    {
      label: "Workflow-Effizienz",
      value: `${workflowData?.efficiency || 0}%`,
      icon: Zap,
      color: "text-accent",
      bgColor: "bg-accent/10",
      description: "Leistung",
      progress: workflowData?.efficiency || 0
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-light text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-on-surface">
                    {stat.label}
                  </div>
                  <div className="text-xs text-subtle">
                    {stat.description}
                  </div>
                </div>

                {stat.progress !== undefined && (
                  <Progress value={stat.progress} className="h-1" />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default IntelligentStats;
