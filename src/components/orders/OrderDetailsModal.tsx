
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Package, Calendar, Euro, FileText, Image, X } from 'lucide-react';
import { downloadFile } from '@/utils/fileDownloadService';
import CustomerInvoicesList from './CustomerInvoicesList';

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ orderId, isOpen, onClose }: OrderDetailsModalProps) => {
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer_profiles!fk_orders_customer_profiles (
            first_name,
            last_name,
            company
          ),
          order_images (
            id,
            file_name,
            file_size,
            file_type,
            storage_path,
            created_at
          ),
          order_invoices (
            id,
            file_name,
            file_size,
            file_type,
            storage_path,
            uploaded_by_name,
            created_at
          ),
          packages (
            name,
            description
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId && isOpen,
  });

  const handleFileDownload = async (image: any) => {
    try {
      const bucket = image.storage_path.includes('order-deliverables') ? 'order-deliverables' : 'order-images';
      await downloadFile(bucket, image.storage_path, image.file_name);
      toast({
        title: "Download gestartet",
        description: `${image.file_name} wird heruntergeladen...`,
      });
    } catch (error) {
      toast({
        title: "Download-Fehler",
        description: "Die Datei konnte nicht heruntergeladen werden.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = async () => {
    if (!order?.order_images || order.order_images.length === 0) {
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
      toast({
        title: "Download-Fehler",
        description: "Einige Dateien konnten nicht heruntergeladen werden.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Warteschlange', className: 'bg-warning text-warning-foreground' },
      processing: { label: 'In Bearbeitung', className: 'bg-primary text-primary-foreground' },
      quality_check: { label: 'Überprüfung', className: 'bg-accent text-accent-foreground' },
      revision: { label: 'In Revision', className: 'bg-orange-100 text-orange-800' },
      completed: { label: 'Abgeschlossen', className: 'bg-success text-success-foreground' },
      delivered: { label: 'Abgeschlossen & bezahlt', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Storniert', className: 'bg-error text-error-foreground' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-secondary text-secondary-foreground' };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-4xl md:max-h-[90vh] md:overflow-y-auto md:rounded-lg w-[100vw] h-[100dvh] max-w-none p-0 rounded-none overflow-hidden">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Bestellung #{order.order_number || order.id.slice(0, 8)}</span>
            {getStatusBadge(order.status || 'pending')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Bestelldetails</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Datum:</span>
                  <span>{new Date(order.created_at).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket:</span>
                  <span>{order.packages?.name || 'Unbekannt'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bilder:</span>
                  <span>{order.order_images?.length || order.image_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gesamtpreis:</span>
                  <span className="font-semibold">€{parseFloat(order.total_price?.toString() || '0').toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.customer_profiles && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Kundeninformationen</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{order.customer_profiles.first_name} {order.customer_profiles.last_name}</span>
                  </div>
                  {order.customer_profiles.company && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unternehmen:</span>
                      <span>{order.customer_profiles.company}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-Mail:</span>
                    <span>{order.customer_email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Files Section */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Dateien ({order.order_images?.length || 0})</h3>
                {order.order_images && order.order_images.length > 0 && (
                  <Button onClick={handleDownloadAll} size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    Alle herunterladen
                  </Button>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {order.order_images?.map((image) => (
                  <div key={image.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getFileIcon(image.file_type)}
                      <div>
                        <p className="text-sm font-medium">{image.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {(image.file_size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleFileDownload(image)}
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
            </div>
          </div>

          {/* Invoices Section */}
          <div className="space-y-4">
            <CustomerInvoicesList invoices={order.order_invoices || []} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
