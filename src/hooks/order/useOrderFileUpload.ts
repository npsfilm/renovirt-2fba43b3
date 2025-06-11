
import { supabase } from '@/integrations/supabase/client';
import { uploadOrderFiles } from '@/utils/fileUploadService';
import { logSecurityEvent } from '@/utils/secureLogging';
import type { OrderData } from '@/utils/orderValidation';

export const useOrderFileUpload = () => {
  const uploadFiles = async (
    files: File[],
    orderId: string,
    userId: string,
    photoType?: string
  ) => {
    return uploadOrderFiles(files, orderId, userId, photoType);
  };

  const uploadWatermarkFile = async (file: File, orderId: string, userId: string) => {
    const fileName = `${orderId}/watermark-${Date.now()}-${file.name}`;
    
    // Upload directly to the bucket without user folder structure
    const { error: uploadError } = await supabase.storage
      .from('order-images')
      .upload(fileName, file);

    if (uploadError) {
      logSecurityEvent('watermark_upload_failed', { fileName: file.name, error: uploadError.message });
      throw new Error(`Wasserzeichen-Upload fehlgeschlagen: ${uploadError.message}`);
    }

    // Save watermark metadata to database
    const { error: dbError } = await supabase
      .from('order_images')
      .insert({
        order_id: orderId,
        file_name: `watermark-${file.name}`,
        file_size: file.size,
        file_type: file.type,
        storage_path: fileName,
        is_bracketing_set: false,
      });

    if (dbError) {
      logSecurityEvent('watermark_metadata_save_failed', { fileName: file.name, error: dbError.message });
      throw new Error(`Wasserzeichen-Metadaten konnten nicht gespeichert werden: ${dbError.message}`);
    }
  };

  const handleOrderFiles = async (orderData: OrderData, orderId: string, userId: string) => {
    try {
      // Upload regular files
      await uploadFiles(orderData.files, orderId, userId, orderData.photoType);

      // Upload watermark file if provided
      if (orderData.watermarkFile && orderData.extras.watermark) {
        await uploadWatermarkFile(orderData.watermarkFile, orderId, userId);
      }
    } catch (error) {
      console.error('Fehler beim Datei-Upload:', error);
      throw error;
    }
  };

  return { handleOrderFiles, uploadFiles, uploadWatermarkFile };
};
