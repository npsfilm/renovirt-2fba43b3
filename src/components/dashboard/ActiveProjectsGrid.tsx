import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Download, ArrowRight, Plus, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from './OrderDetailsModal';
const ActiveProjectsGrid = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: activeProjects,
    isLoading
  } = useQuery({
    queryKey: ['active-projects', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const {
        data,
        error
      } = await supabase.from('orders').select('*').eq('user_id', user.id).in('status', ['pending', 'processing', 'quality_check']).neq('payment_flow_status', 'draft').order('created_at', {
        ascending: false
      }).limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        label: 'Warteschlange',
        progress: 10,
        color: 'bg-warning text-warning-foreground',
        description: 'Wird bald bearbeitet'
      },
      processing: {
        label: 'In Bearbeitung',
        progress: 60,
        color: 'bg-primary text-primary-foreground',
        description: 'Aktive Bearbeitung'
      },
      quality_check: {
        label: 'Qualitätsprüfung',
        progress: 90,
        color: 'bg-accent text-accent-foreground',
        description: 'Fast fertig'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };
  const formatOrderId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;
  const getImageText = (count: number) => {
    return count === 1 ? '1 Bild' : `${count} Bilder`;
  };
  const getEstimatedCompletion = (project: any) => {
    if (!project.created_at) return 'Unbekannt';
    const orderDate = new Date(project.created_at);
    // Check if 24h service was booked (this would need to be stored in the order data)
    // For now, assuming standard 48h service
    const hoursToAdd = project.express_service ? 24 : 48;
    const estimatedDate = new Date(orderDate.getTime() + hoursToAdd * 60 * 60 * 1000);
    return estimatedDate.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleViewProject = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  if (isLoading) {
    return <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-light text-foreground">Aktive Projekte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>;
  }
  if (!activeProjects?.length) {
    return <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-light text-foreground">Aktive Projekte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Image className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-foreground font-medium">Keine aktiven Projekte</p>
              <p className="text-subtle text-sm">Starten Sie Ihr erstes Projekt</p>
            </div>
            <Button onClick={() => navigate('/order')} className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Projekt starten
            </Button>
          </div>
        </CardContent>
      </Card>;
  }
  return <>
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between py-[12px]">
          <CardTitle className="text-xl font-light text-foreground">Aktive Projekte</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-subtle hover:text-foreground">
            Alle anzeigen
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map(project => {
            const statusConfig = getStatusConfig(project.status);
            return <div key={project.id} className="group">
                  <Card className="border border-border/50 hover:border-border transition-all duration-300 hover:shadow-sm">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-mono text-sm text-foreground">
                            {formatOrderId(project.id)}
                          </div>
                          <div className="text-xs text-subtle">
                            {getImageText(project.image_count)}
                          </div>
                        </div>
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-subtle">Fortschritt</span>
                          <span className="text-foreground font-medium">{statusConfig.progress}%</span>
                        </div>
                        <Progress value={statusConfig.progress} className="h-1" />
                        <div className="text-xs text-subtle">{statusConfig.description}</div>
                      </div>

                      <div className="text-xs text-subtle">
                        <div>Fertigstellung bis voraussichtlich:</div>
                        <div className="font-medium text-foreground">{getEstimatedCompletion(project)}</div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewProject(project)} className="flex-1 justify-center">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        {project.status === 'completed' && <Button size="sm" variant="ghost">
                            <Download className="w-3 h-3" />
                          </Button>}
                      </div>
                    </CardContent>
                  </Card>
                </div>;
          })}
          </div>
        </CardContent>
      </Card>

      <OrderDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} order={selectedOrder} />
    </>;
};
export default ActiveProjectsGrid;