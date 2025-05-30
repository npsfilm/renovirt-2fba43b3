
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
      return orderData;
    },
    enabled: isOpen,
  });

  // Update order status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (notes) {
        updateData.admin_notes = notes;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status aktualisiert",
        description: "Der Bestellstatus wurde erfolgreich aktualisiert.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-details', orderId] });
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bestellung #{order?.id.slice(0, 8)}
            <OrderStatusBadge status={order?.status || 'pending'} />
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderInfo order={order} />
          
          <StatusManager
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            notes={notes}
            setNotes={setNotes}
            onStatusUpdate={handleStatusUpdate}
            isUpdating={updateStatusMutation.isPending}
          />

          <div className="lg:col-span-2">
            <OrderFilesList
              order={order}
              onFileDownload={handleFileDownload}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
