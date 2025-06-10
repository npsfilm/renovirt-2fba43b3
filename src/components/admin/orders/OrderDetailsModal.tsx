
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OrderStatusBadge from './OrderStatusBadge';
import { downloadFile } from '@/utils/fileDownloadService';
import QuickActions from './QuickActions';
import OrderSummary from './OrderSummary';
import StatusAndNotes from './StatusAndNotes';
import FilesAndInvoices from './FilesAndInvoices';
import CustomerDetails from './CustomerDetails';
import type { ExtendedOrder } from '@/types/database';

interface OrderDetailsModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ orderId, isOpen, onClose }: OrderDetailsModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch order details with invoices
  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async (): Promise<ExtendedOrder & { order_invoices?: any[] }> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer_profiles!fk_orders_customer_profiles (
            first_name,
            last_name,
            company,
            phone,
            address
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
      
      const orderData = data as ExtendedOrder & { order_invoices?: any[] };
      setSelectedStatus(orderData.status || 'pending');
      setNotes(orderData.admin_notes || '');
      return orderData;
    },
    enabled: isOpen,
  });

  // Update order status using the database function
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      const { error } = await supabase.rpc('update_order_status', {
        p_order_id: orderId,
        p_status: status,
        p_message: `Status aktualisiert von Admin`,
        p_admin_notes: notes
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status aktualisiert",
        description: "Der Bestellstatus wurde erfolgreich aktualisiert und der Kunde wurde benachrichtigt.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
    },
    onError: (error: any) => {
      console.error('Status update error:', error);
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = () => {
    updateStatusMutation.mutate({ status: selectedStatus, notes });
  };

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

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold">
                #{order?.order_number || order?.id.slice(0, 8)}
              </span>
              <OrderStatusBadge status={order?.status || 'pending'} />
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Quick Actions - Most Important at Top */}
        <QuickActions
          order={order}
          selectedStatus={selectedStatus}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={updateStatusMutation.isPending}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Order Summary (Primary Info) */}
          <div className="lg:col-span-1 space-y-4">
            <OrderSummary order={order} />
            <CustomerDetails order={order} />
          </div>

          {/* Center Column - Status Management */}
          <div className="lg:col-span-1 space-y-4">
            <StatusAndNotes
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              notes={notes}
              setNotes={setNotes}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={updateStatusMutation.isPending}
            />
          </div>

          {/* Right Column - Files and Invoices */}
          <div className="lg:col-span-1 space-y-4">
            <FilesAndInvoices
              order={order}
              orderId={orderId}
              onFileDownload={handleFileDownload}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
