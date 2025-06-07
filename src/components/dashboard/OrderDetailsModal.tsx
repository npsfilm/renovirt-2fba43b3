
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Image } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    status: string;
    image_count: number;
    created_at: string;
    total_price?: number;
  } | null;
}

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!order) return null;

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
      },
      completed: { 
        label: 'Abgeschlossen', 
        progress: 100, 
        color: 'bg-success text-success-foreground',
        description: 'Bereit zum Download'
      }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const statusConfig = getStatusConfig(order.status);
  const formatOrderId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Bestellung {formatOrderId(order.id)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className={statusConfig.color}>
              {statusConfig.label}
            </Badge>
            <div className="text-sm text-subtle">
              {order.image_count} Bilder
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-subtle">Fortschritt</span>
              <span className="text-foreground font-medium">{statusConfig.progress}%</span>
            </div>
            <Progress value={statusConfig.progress} className="h-2" />
            <div className="text-sm text-subtle">{statusConfig.description}</div>
          </div>

          <div className="flex items-center gap-2 text-sm text-subtle">
            <Calendar className="w-4 h-4" />
            <span>Erstellt am {new Date(order.created_at).toLocaleDateString('de-DE')}</span>
          </div>

          {order.total_price && (
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <span className="text-sm font-medium">Gesamtpreis</span>
              <span className="font-bold">€{parseFloat(order.total_price.toString()).toFixed(2)}</span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {order.status === 'completed' && (
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1">
              Schließen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
