
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
    throw new Error(`Datei-Validierung fehlgeschlagen: ${validation.errors.join(', ')}`);
  }

  const uploadPromises = files.map(async (file, index) => {
    const sanitizedFileName = sanitizeFilename(file.name);
    const fileName = `${orderId}/${Date.now()}-${index}-${sanitizedFileName}`;
    
    secureLog('Datei wird hochgeladen:', { fileName: sanitizedFileName, size: file.size });
    
    // Upload directly to the bucket without user folder structure
    const { error: uploadError } = await supabase.storage
      .from('order-images')
      .upload(fileName, file);

    if (uploadError) {
      logSecurityEvent('file_upload_failed', { fileName: sanitizedFileName, error: uploadError.message });
      throw new Error(`Upload fehlgeschlagen für ${sanitizedFileName}: ${uploadError.message}`);
    }

    // Save file metadata to database
    const { error: dbError } = await supabase
      .from('order_images')
      .insert({
        order_id: orderId,
        file_name: sanitizedFileName,
        file_size: file.size,
        file_type: file.type,
        storage_path: fileName,
        is_bracketing_set: photoType?.startsWith('bracketing') || false,
      });

    if (dbError) {
      logSecurityEvent('file_metadata_save_failed', { fileName: sanitizedFileName, error: dbError.message });
      throw new Error(`Metadaten konnten nicht gespeichert werden für ${sanitizedFileName}: ${dbError.message}`);
    }
    
    logSecurityEvent('file_uploaded_successfully', { fileName: sanitizedFileName });
  });

  await Promise.all(uploadPromises);
};
