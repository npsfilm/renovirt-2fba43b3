
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Lightbulb, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const SmartInsights = () => {
  const { user } = useAuth();

  const { data: insights } = useQuery({
    queryKey: ['smart-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, created_at, image_count')
        .eq('user_id', user.id)
        .neq('payment_flow_status', 'draft');

      if (error) throw error;

      // Calculate insights
      const completedOrders = orders?.filter(order => order.status === 'completed') || [];
      const avgTurnaround = completedOrders.length > 0 ? 2.5 : 0; // Mock average
      const totalImages = orders?.reduce((sum, order) => sum + (order.image_count || 0), 0) || 0;
      
      return {
        avgTurnaround,
        totalImages,
        trend: completedOrders.length > 5 ? 'improving' : 'stable'
      };
    },
    enabled: !!user?.id,
  });

  const insightCards = [
    {
      icon: Clock,
      title: "Durchschnittliche Bearbeitungszeit",
      value: `${insights?.avgTurnaround || 0} Tage`,
      description: "Ihre Projekte werden schnell bearbeitet",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: TrendingUp,
      title: "Ihre Produktivität",
      value: `${insights?.totalImages || 0} Bilder`,
      description: "Insgesamt bearbeitet",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Lightbulb,
      title: "Empfehlung",
      value: "Premium Paket",
      description: "Für noch bessere Ergebnisse",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-light text-foreground">Intelligente Einblicke</CardTitle>
        <Button variant="ghost" size="sm" className="text-subtle hover:text-foreground">
          Mehr
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insightCards.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-background/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${insight.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{insight.value}</div>
                    <div className="text-xs text-subtle">{insight.title}</div>
                  </div>
                </div>
                <div className="text-xs text-subtle">{insight.description}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartInsights;
