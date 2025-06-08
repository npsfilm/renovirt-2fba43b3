
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
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

interface OrdersTableProps {
  orders: Order[];
  onOrderSelect: (orderId: string) => void;
}

const OrdersTable = ({ orders, onOrderSelect }: OrdersTableProps) => {
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Warteschlange', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      processing: { label: 'In Bearbeitung', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      quality_check: { label: 'Überprüfung', className: 'bg-purple-100 text-purple-800 border-purple-200' },
      revision: { label: 'In Revision', className: 'bg-orange-100 text-orange-800 border-orange-200' },
      completed: { label: 'Abgeschlossen', className: 'bg-green-100 text-green-800 border-green-200' },
      delivered: { label: 'Abgeschlossen & bezahlt', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      cancelled: { label: 'Storniert', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
      <Badge 
        variant="outline" 
        className={`${config.className} font-medium`}
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
      <div className="text-center py-12">
        <div className="space-y-3">
          <p className="text-lg font-medium text-muted-foreground">
            Noch keine Bestellungen vorhanden
          </p>
          <p className="text-sm text-muted-foreground">
            Ihre Bestellungen werden hier angezeigt, sobald Sie eine aufgeben.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Bestellnummer
              </th>
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Datum
              </th>
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Paket
              </th>
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Bilder
              </th>
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Preis
              </th>
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Status
              </th>
              <th className="text-left py-4 px-4 font-medium text-sm text-muted-foreground">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-background">
            {orders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  index === orders.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-sm font-medium">
                    {order.order_number || `#${order.id.slice(0, 8)}`}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm">
                  {formatDate(order.created_at)}
                </td>
                <td className="py-4 px-4 text-sm">
                  {order.packages?.name || 'Unbekannt'}
                </td>
                <td className="py-4 px-4 text-sm">
                  {order.order_images?.length || order.image_count || 0}
                </td>
                <td className="py-4 px-4 text-sm font-medium">
                  {formatPrice(order.total_price)}
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOrderSelect(order.id)}
                      className="h-8 w-8 p-0 hover:bg-muted"
                      title="Details anzeigen"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(order.status === 'completed' || order.status === 'delivered') && 
                     order.order_images && order.order_images.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                        onClick={() => handleDownloadAll(order)}
                        title="Alle Dateien herunterladen"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
