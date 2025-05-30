
import React from 'react';
import { downloadFile } from '@/utils/fileDownloadService';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customer_email: string;
  image_count: number;
  total_price: number;
  status: string;
  created_at: string;
  customer_profiles: {
    first_name: string;
    last_name: string;
    company?: string;
  } | null;
  order_images?: Array<{
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    storage_path: string;
  }>;
}

export const useOrderTableActions = () => {
  const { toast } = useToast();

  const handleDownloadAll = async (order: Order) => {
    try {
      if (!order.order_images || order.order_images.length === 0) {
        toast({
          title: "Keine Dateien",
          description: "Diese Bestellung enthält keine Dateien zum Herunterladen.",
          variant: "destructive",
        });
        return;
      }

      // Download all files for this order
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

  const createOrderZip = async (order: Order) => {
    try {
      if (!order.order_images || order.order_images.length === 0) {
        toast({
          title: "Keine Dateien",
          description: "Diese Bestellung enthält keine Dateien für ein ZIP-Archiv.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "ZIP wird erstellt",
        description: "Das ZIP-Archiv wird vorbereitet...",
      });

      // This would ideally be handled by an edge function
      // For now, we'll download files individually
      await handleDownloadAll(order);
      
    } catch (error) {
      toast({
        title: "ZIP-Fehler",
        description: "Das ZIP-Archiv konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  return {
    handleDownloadAll,
    createOrderZip,
  };
};
