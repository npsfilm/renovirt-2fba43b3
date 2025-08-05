import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Package, Calendar, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/utils/fileDownloadService';

interface Order {
  id: string;
  order_number?: string;
  customer_email: string;
  image_count: number;
  total_price: number;
  status: string;
  created_at: string;
  packages?: {
    name: string;
    description: string;
  };
  order_images?: Array<{
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    storage_path: string;
  }>;
}

interface OrderCardsMobileProps {
  orders: Order[];
  onOrderSelect: (orderId: string) => void;
}

const OrderCardsMobile = ({ orders, onOrderSelect }: OrderCardsMobileProps) => {
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Warteschlange', className: 'bg-warning/10 text-warning border-warning/20' },
      processing: { label: 'In Bearbeitung', className: 'bg-primary/10 text-primary border-primary/20' },
      quality_check: { label: 'Überprüfung', className: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
      revision: { label: 'In Revision', className: 'bg-accent/10 text-accent border-accent/20' },
      completed: { label: 'Abgeschlossen', className: 'bg-success/10 text-success border-success/20' },
      delivered: { label: 'Bezahlt', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
      cancelled: { label: 'Storniert', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-muted/10 text-muted-foreground border-muted/20' };

    return (
      <Badge 
        variant="outline" 
        className={`${config.className} font-medium text-xs`}
      >
        {config.label}
      </Badge>
    );
  };

  const handleDownloadAll = async (order: Order) => {
    if (!order.order_images || order.order_images.length === 0) {
      toast({
        title: "Keine Dateien",
        description: "Diese Bestellung enthält keine Dateien zum Herunterladen.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const image of order.order_images) {
        const bucket = image.storage_path.includes('order-deliverables') ? 'order-deliverables' : 'order-images';
        await downloadFile(bucket, image.storage_path, image.file_name);
      }
      
      toast({
        title: "Downloads gestartet",
        description: `${order.order_images.length} Datei(en) werden heruntergeladen...`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download-Fehler",
        description: "Einige Dateien konnten nicht heruntergeladen werden.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Ungültiges Datum';
    }
  };

  const formatPrice = (price: number) => {
    try {
      return `€${price.toFixed(2)}`;
    } catch (error) {
      return '€0.00';
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="space-y-4">
          <Package className="w-16 h-16 mx-auto text-muted-foreground/50" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              Noch keine Bestellungen vorhanden
            </p>
            <p className="text-sm text-muted-foreground">
              Ihre Bestellungen werden hier angezeigt, sobald Sie eine aufgeben.
            </p>
          </div>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => window.location.href = '/order-flow'}
          >
            Erste Bestellung erstellen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {orders.map((order) => (
        <Card 
          key={order.id} 
          className="border border-border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-200"
        >
          <CardContent className="p-4">
            {/* Header mit Order-Nummer und Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm font-medium">
                  {order.order_number || `#${order.id.slice(0, 8)}`}
                </span>
              </div>
              {getStatusBadge(order.status)}
            </div>

            {/* Order Details */}
            <div className="space-y-3">
              {/* Paket & Bilder Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Image className="w-4 h-4" />
                    <span>{order.order_images?.length || order.image_count || 0} Bilder</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.packages?.name || 'Unbekannt'}
                  </div>
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {formatPrice(order.total_price)}
                </div>
              </div>

              {/* Datum */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(order.created_at)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOrderSelect(order.id)}
                  className="flex-1 gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Details
                </Button>
                {(order.status === 'completed' || order.status === 'delivered') && 
                 order.order_images && order.order_images.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadAll(order)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderCardsMobile;