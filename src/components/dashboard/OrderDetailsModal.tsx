
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Image, Receipt, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Fetch full order details including invoices
  const { data: fullOrder } = useQuery({
    queryKey: ['order-details-with-invoices', order?.id],
    queryFn: async () => {
      if (!order?.id) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_invoices (
            id,
            file_name,
            file_size,
            file_type,
            storage_path,
            uploaded_by_name,
            created_at
          )
        `)
        .eq('id', order.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!order?.id && isOpen,
  });

  const downloadInvoice = async (invoice: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('order-invoices')
        .download(invoice.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = invoice.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download gestartet",
        description: `${invoice.file_name} wird heruntergeladen...`,
      });
    } catch (error) {
      toast({
        title: "Download-Fehler",
        description: "Die Rechnung konnte nicht heruntergeladen werden.",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex items-center justify-between hover:bg-transparent">
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

          {/* Invoices Section */}
          {fullOrder?.order_invoices && fullOrder.order_invoices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                <span className="font-medium text-sm">Rechnungen ({fullOrder.order_invoices.length})</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {fullOrder.order_invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-2 border rounded text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span className="truncate">{invoice.file_name}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadInvoice(invoice)}
                      className="h-6 px-2 text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
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
