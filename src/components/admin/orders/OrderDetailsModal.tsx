
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OrderStatusBadge from './OrderStatusBadge';
import { downloadFile } from '@/utils/fileDownloadService';
import OrderInfo from './OrderInfo';
import StatusManager from './StatusManager';
import OrderFilesList from './OrderFilesList';
import OrderStatusTimeline from '@/components/order/OrderStatusTimeline';
import type { ExtendedOrder } from '@/types/database';

interface OrderDetailsModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ orderId, isOpen, onClose }: OrderDetailsModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: async (): Promise<ExtendedOrder> => {
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
          packages (
            name,
            description
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      const orderData = data as ExtendedOrder;
      setSelectedStatus(orderData.status || 'pending');
      setNotes(orderData.admin_notes || '');
      if (orderData.estimated_completion) {
        setEstimatedCompletion(new Date(orderData.estimated_completion).toISOString().slice(0, 16));
      }
      return orderData;
    },
    enabled: isOpen,
  });

  // Fetch status history
  const { data: statusHistory } = useQuery({
    queryKey: ['order-status-history', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  // Update order status using the function
  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('update_order_status', {
        p_order_id: orderId,
        p_status: selectedStatus,
        p_message: message || null,
        p_estimated_completion: estimatedCompletion ? new Date(estimatedCompletion).toISOString() : null,
        p_admin_notes: notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status aktualisiert",
        description: "Der Bestellstatus wurde erfolgreich aktualisiert.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
      queryClient.invalidateQueries({ queryKey: ['order-status-history', orderId] });
      setMessage(''); // Reset message after update
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = () => {
    updateStatusMutation.mutate();
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bestellung #{order?.id.slice(0, 8)}
            <OrderStatusBadge status={order?.status || 'pending'} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info and Files */}
          <div className="lg:col-span-2 space-y-6">
            <OrderInfo order={order} />
            
            <OrderFilesList
              order={order}
              onFileDownload={handleFileDownload}
            />

            {statusHistory && statusHistory.length > 0 && (
              <OrderStatusTimeline
                statusHistory={statusHistory}
                currentStatus={order?.status || 'pending'}
                estimatedCompletion={order?.estimated_completion}
              />
            )}
          </div>

          {/* Right Column - Status Management */}
          <div>
            <StatusManager
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              notes={notes}
              setNotes={setNotes}
              message={message}
              setMessage={setMessage}
              estimatedCompletion={estimatedCompletion}
              setEstimatedCompletion={setEstimatedCompletion}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={updateStatusMutation.isPending}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
