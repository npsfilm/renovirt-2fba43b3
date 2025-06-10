
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image, Package, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InvoiceUpload from './InvoiceUpload';
import { createOrderZip } from '@/utils/zipDownloadService';
import type { ExtendedOrder } from '@/types/database';

interface FilesAndInvoicesProps {
  order: ExtendedOrder | undefined;
  orderId: string;
  onFileDownload: (image: any) => void;
}

const FilesAndInvoices = ({ order, orderId, onFileDownload }: FilesAndInvoicesProps) => {
  const { toast } = useToast();

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    if (fileType.includes('zip')) return <Package className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const handleZipDownload = async () => {
    if (!order?.order_images || order.order_images.length === 0) {
      toast({
        title: "Keine Dateien",
        description: "Diese Bestellung enthält keine Dateien für ein ZIP-Archiv.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "ZIP wird erstellt",
        description: "Das ZIP-Archiv wird vorbereitet...",
      });

      const orderNumber = order.order_number || `Bestellung-${order.id.slice(0, 8)}`;
      await createOrderZip(order.order_images, orderNumber, 'order-images');

      toast({
        title: "ZIP-Download gestartet",
        description: `${orderNumber}.zip wird heruntergeladen...`,
      });
    } catch (error) {
      toast({
        title: "ZIP-Fehler",
        description: "Das ZIP-Archiv konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Invoice Upload - Most Important */}
      <Card>
        <CardContent className="p-4">
          <InvoiceUpload 
            orderId={orderId} 
            existingInvoices={order?.order_invoices || []} 
          />
        </CardContent>
      </Card>

      {/* Order Files */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bestelldateien ({order?.order_images?.length || 0})
            </div>
            {order?.order_images && order.order_images.length > 0 && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleZipDownload}
                className="flex items-center gap-2"
              >
                <Archive className="w-4 h-4" />
                ZIP Download
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {order?.order_images?.map((image) => (
              <div key={image.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  {getFileIcon(image.file_type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{image.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {(image.file_size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onFileDownload(image)}
                  className="flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )) || (
              <p className="text-sm text-gray-500 text-center py-4">
                Keine Dateien vorhanden
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilesAndInvoices;
