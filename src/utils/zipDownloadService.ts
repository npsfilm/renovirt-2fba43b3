
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { secureLog } from './secureLogging';

interface FileItem {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
}

export const createOrderZip = async (
  files: FileItem[],
  orderNumber: string,
  bucketName: string = 'order-images'
): Promise<void> => {
  try {
    const zip = new JSZip();
    const folder = zip.folder(orderNumber);
    
    if (!folder) {
      throw new Error('Fehler beim Erstellen des ZIP-Ordners');
    }

    // Download all files and add them to the ZIP
    const downloadPromises = files.map(async (file) => {
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(file.storage_path);

        if (error) {
          secureLog('Failed to download file for ZIP:', { fileName: file.file_name, error });
          return null;
        }

        // Add file to ZIP folder
        folder.file(file.file_name, data);
        return file.file_name;
      } catch (error) {
        secureLog('Error downloading file for ZIP:', { fileName: file.file_name, error });
        return null;
      }
    });

    const results = await Promise.all(downloadPromises);
    const successfulFiles = results.filter(Boolean);

    if (successfulFiles.length === 0) {
      throw new Error('Keine Dateien konnten heruntergeladen werden');
    }

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${orderNumber}.zip`);

    secureLog('ZIP created successfully:', { 
      orderNumber, 
      filesCount: successfulFiles.length,
      totalFiles: files.length 
    });

  } catch (error) {
    secureLog('ZIP creation failed:', { orderNumber, error });
    throw error;
  }
};
