
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
    
    const { error: uploadError } = await supabase.storage
      .from('order-images')
      .upload(`${userId}/${fileName}`, file);

    if (uploadError) {
      logSecurityEvent('watermark_upload_failed', { fileName: file.name, error: uploadError.message });
      throw uploadError;
    }

    // Save watermark metadata to database
    const { error: dbError } = await supabase
      .from('order_images')
      .insert({
        order_id: orderId,
        file_name: `watermark-${file.name}`,
        file_size: file.size,
        file_type: file.type,
        storage_path: `${userId}/${fileName}`,
        is_bracketing_set: false,
      });

    if (dbError) {
      logSecurityEvent('watermark_metadata_save_failed', { fileName: file.name, error: dbError.message });
      throw dbError;
    }
  };

  const handleOrderFiles = async (orderData: OrderData, orderId: string, userId: string) => {
    // Upload regular files
    await uploadFiles(orderData.files, orderId, userId, orderData.photoType);

    // Upload watermark file if provided
    if (orderData.watermarkFile && orderData.extras.watermark) {
      await uploadWatermarkFile(orderData.watermarkFile, orderId, userId);
    }
  };

  return { handleOrderFiles, uploadFiles, uploadWatermarkFile };
};
