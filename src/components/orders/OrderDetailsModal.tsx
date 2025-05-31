
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, Image } from 'lucide-react';

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ orderId, isOpen, onClose }: OrderDetailsModalProps) => {
  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_images (
            id,
            file_name,
            file_size,
            file_type,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Fertig';
      case 'processing':
        return 'In Bearbeitung';
      case 'pending':
        return 'Ausstehend';
      case 'payment_pending':
        return 'Zahlung ausstehend';
      default:
        return status;
    }
  };

  const formatOrderId = (id: string) => {
    return `ORD-${id.slice(0, 8).toUpperCase()}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bestellung {formatOrderId(order.id)}
            <Badge className={getStatusColor(order.status || 'pending')}>
              {getStatusLabel(order.status || 'pending')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bestelldetails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Bestellnummer</p>
                <p className="font-medium">{formatOrderId(order.id)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Erstellt am</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Paket</p>
                <p className="font-medium">{(order.packages as any)?.name || 'Standard Paket'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Anzahl Bilder</p>
                <p className="font-medium">{order.image_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gesamtpreis</p>
                <p className="font-medium">€{parseFloat(order.total_price?.toString() || '0').toFixed(2)}</p>
              </div>
              {order.photo_type && (
                <div>
                  <p className="text-sm text-gray-600">Fototyp</p>
                  <p className="font-medium">{order.photo_type}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dateien ({order.order_images?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_images && order.order_images.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {order.order_images.map((image: any) => (
                    <div key={image.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <Image className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{image.file_name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(image.file_size)} • {image.file_type}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Keine Dateien vorhanden</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {order.status === 'completed' && (
          <div className="flex justify-end mt-6">
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Alle Dateien herunterladen
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
