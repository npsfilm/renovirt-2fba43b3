
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Calendar, Euro, Download, FileText } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';

interface CustomerOrdersModalProps {
  customerId: string | null;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerOrdersModal = ({ customerId, customerName, isOpen, onClose }: CustomerOrdersModalProps) => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['customer-orders', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_images (
            id,
            file_name
          )
        `)
        .eq('user_id', (await supabase
          .from('customer_profiles')
          .select('user_id')
          .eq('id', customerId)
          .single()
        ).data?.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!customerId,
  });

  const handleAttachInvoice = (orderId: string) => {
    // TODO: Implement invoice attachment functionality
    console.log('Attach invoice for order:', orderId);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Bestellungen von {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Bestellung #{order.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at).toLocaleDateString('de-DE')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Euro className="w-4 h-4" />
                          €{parseFloat(order.total_price?.toString() || '0').toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <OrderStatusBadge status={order.status || 'pending'} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium">Bildanzahl:</span>
                      <p className="text-lg">{order.order_images?.length || order.image_count || 0}</p>
                    </div>
                    
                    {order.photo_type && (
                      <div>
                        <span className="text-sm font-medium">Foto-Typ:</span>
                        <p>{order.photo_type}</p>
                      </div>
                    )}

                    {order.bracketing_enabled && (
                      <div>
                        <span className="text-sm font-medium">Bracketing:</span>
                        <p>{order.bracketing_exposures} Belichtungen</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Dateien
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAttachInvoice(order.id)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Rechnung anhängen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Keine Bestellungen gefunden</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerOrdersModal;
