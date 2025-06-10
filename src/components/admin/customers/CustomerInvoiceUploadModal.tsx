
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, ShoppingCart } from 'lucide-react';
import InvoiceUpload from '@/components/admin/orders/InvoiceUpload';

interface CustomerInvoiceUploadModalProps {
  customerId: string | null;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerInvoiceUploadModal = ({ customerId, customerName, isOpen, onClose }: CustomerInvoiceUploadModalProps) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['customer-orders-for-invoice', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          created_at,
          total_price,
          status,
          order_invoices (
            id,
            file_name,
            file_size,
            created_at,
            uploaded_by_name
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

  const selectedOrder = orders?.find(order => order.id === selectedOrderId);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Rechnung anhängen für {customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Bestellung auswählen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Bestellung für Rechnung auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {orders?.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      Bestellung #{order.order_number || order.id.slice(0, 8)} - 
                      €{parseFloat(order.total_price?.toString() || '0').toFixed(2)} - 
                      {new Date(order.created_at).toLocaleDateString('de-DE')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {orders && orders.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Keine Bestellungen für diesen Kunden gefunden
                </p>
              )}
            </CardContent>
          </Card>

          {/* Invoice Upload Section */}
          {selectedOrderId && selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Rechnung für Bestellung #{selectedOrder.order_number || selectedOrder.id.slice(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceUpload 
                  orderId={selectedOrderId}
                  existingInvoices={selectedOrder.order_invoices || []}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerInvoiceUploadModal;
