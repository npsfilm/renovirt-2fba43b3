import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Download, Clock, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import OrderDetailsModal from '@/components/orders/OrderDetailsModal';

const ActiveProjectsCarousel = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: activeProjects, isLoading } = useQuery({
    queryKey: ['active-projects-mobile', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          created_at,
          updated_at,
          image_count,
          total_price,
          payment_status
        `)
        .eq('user_id', user.id)
        .in('status', ['pending', 'processing', 'quality_check'])
        .neq('payment_status', 'draft')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return orders || [];
    },
    enabled: !!user?.id,
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Warteschlange',
          color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
          progress: 25,
        };
      case 'processing':
        return {
          label: 'In Bearbeitung',
          color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          progress: 60,
        };
      case 'quality_check':
        return {
          label: 'Qualitätsprüfung',
          color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
          progress: 85,
        };
      default:
        return {
          label: status,
          color: 'bg-muted/50 text-muted-foreground border-muted',
          progress: 0,
        };
    }
  };

  const getEstimatedCompletion = (createdAt: string, status: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    
    let estimatedHours = 24; // Base estimate
    if (status === 'processing') estimatedHours = 12;
    if (status === 'quality_check') estimatedHours = 4;
    
    const remaining = Math.max(0, estimatedHours - hoursElapsed);
    if (remaining === 0) return 'Bald fertig';
    if (remaining < 1) return 'Weniger als 1 Stunde';
    if (remaining < 24) return `~${Math.ceil(remaining)} Stunden`;
    return `~${Math.ceil(remaining / 24)} Tage`;
  };

  if (isLoading) {
    return (
      <div className="px-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="min-w-[280px] animate-pulse">
              <CardContent className="p-4">
                <div className="h-32 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!activeProjects?.length) {
    return (
      <div className="px-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Keine aktiven Projekte
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Starten Sie ein neues Projekt, um loszulegen
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {activeProjects.map((project) => {
          const statusConfig = getStatusConfig(project.status);
          const estimated = getEstimatedCompletion(project.created_at, project.status);
          
          return (
            <Card 
              key={project.id} 
              className="min-w-[280px] bg-card/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-foreground">
                        Bestellung #{project.order_number || project.id.slice(-8)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {project.image_count} {project.image_count === 1 ? 'Bild' : 'Bilder'}
                      </p>
                    </div>
                    <Badge variant="outline" className={statusConfig.color}>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Fortschritt</span>
                      <span className="text-muted-foreground">{statusConfig.progress}%</span>
                    </div>
                    <Progress value={statusConfig.progress} className="h-2" />
                  </div>

                  {/* Estimated completion */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Fertig in {estimated}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(project)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                    {project.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-success/20 text-success hover:bg-success/10"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          orderId={selectedOrder.id}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default ActiveProjectsCarousel;