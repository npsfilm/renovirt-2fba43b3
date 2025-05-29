
import { supabase } from '@/integrations/supabase/client';
import { validateOrderFiles } from './orderValidation';
import { sanitizeFilename } from './inputValidation';
import { secureLog, logSecurityEvent } from './secureLogging';

export const uploadOrderFiles = async (
  files: File[], 
  orderId: string, 
  userId: string,
  photoType?: string
): Promise<void> => {
  // Validate all files first
  const validation = validateOrderFiles(files);
  if (!validation.isValid) {
    throw new Error(`File validation failed: ${validation.errors.join(', ')}`);
  }

  const uploadPromises = files.map(async (file, index) => {
    const sanitizedFileName = sanitizeFilename(file.name);
    const fileName = `${orderId}/${Date.now()}-${index}-${sanitizedFileName}`;
    
    secureLog('Uploading file:', { fileName: sanitizedFileName, size: file.size });
    
    const { error: uploadError } = await supabase.storage
      .from('order-images')
      .upload(`${userId}/${fileName}`, file);

    if (uploadError) {
      logSecurityEvent('file_upload_failed', { fileName: sanitizedFileName, error: uploadError.message });
      throw uploadError;
    }

    // Save file metadata to database
    const { error: dbError } = await supabase
      .from('order_images')
      .insert({
        order_id: orderId,
        file_name: sanitizedFileName,
        file_size: file.size,
        file_type: file.type,
        storage_path: `${userId}/${fileName}`,
        is_bracketing_set: photoType?.startsWith('bracketing') || false,
      });

    if (dbError) {
      logSecurityEvent('file_metadata_save_failed', { fileName: sanitizedFileName, error: dbError.message });
      throw dbError;
    }
    
    logSecurityEvent('file_uploaded_successfully', { fileName: sanitizedFileName });
  });

  await Promise.all(uploadPromises);
};
