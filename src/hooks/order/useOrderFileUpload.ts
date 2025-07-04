
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
    const uploadResults = {
      regularFiles: { success: false, error: null as string | null },
      watermarkFile: { success: false, error: null as string | null }
    };

    try {
      // Upload regular files with detailed error tracking
      try {
        await uploadFiles(orderData.files, orderId, userId, orderData.photoType);
        uploadResults.regularFiles.success = true;
      } catch (regularError: any) {
        uploadResults.regularFiles.error = regularError.message;
        logSecurityEvent('regular_files_upload_failed', { 
          orderId, 
          fileCount: orderData.files.length,
          error: regularError.message 
        });
      }

      // Upload watermark file if provided
      if (orderData.watermarkFile && orderData.extras.watermark) {
        try {
          await uploadWatermarkFile(orderData.watermarkFile, orderId, userId);
          uploadResults.watermarkFile.success = true;
        } catch (watermarkError: any) {
          uploadResults.watermarkFile.error = watermarkError.message;
          logSecurityEvent('watermark_upload_failed', { 
            orderId, 
            fileName: orderData.watermarkFile.name,
            error: watermarkError.message 
          });
        }
      }

      // If both critical uploads failed, throw error
      if (!uploadResults.regularFiles.success && orderData.files.length > 0) {
        throw new Error(`Haupt-Upload fehlgeschlagen: ${uploadResults.regularFiles.error}`);
      }

      // Log partial failures but don't throw
      if (uploadResults.watermarkFile.error) {
        console.warn('Wasserzeichen-Upload fehlgeschlagen:', uploadResults.watermarkFile.error);
      }

    } catch (error: any) {
      console.error('Fehler beim Datei-Upload:', error);
      logSecurityEvent('file_upload_critical_failure', { 
        orderId, 
        error: error.message,
        results: uploadResults 
      });
      throw error;
    }
  };

  return { handleOrderFiles, uploadFiles, uploadWatermarkFile };
};
