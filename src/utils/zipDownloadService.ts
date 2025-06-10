
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';
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
    secureLog('Starting ZIP creation:', { 
      orderNumber, 
      filesCount: files.length,
      bucketName,
      files: files.map(f => ({ name: f.file_name, path: f.storage_path }))
    });

    if (!files || files.length === 0) {
      throw new Error('Keine Dateien zum Herunterladen vorhanden');
    }

    const zip = new JSZip();
    const folder = zip.folder(orderNumber);
    
    if (!folder) {
      throw new Error('Fehler beim Erstellen des ZIP-Ordners');
    }

    // Download all files and add them to the ZIP
    const downloadPromises = files.map(async (file) => {
      try {
        secureLog('Attempting to download file:', { 
          fileName: file.file_name, 
          storagePath: file.storage_path,
          bucketName 
        });

        // Try downloading from the specified bucket
        const { data, error } = await supabase.storage
          .from(bucketName)
          .download(file.storage_path);

        if (error) {
          secureLog('Storage download error:', { 
            fileName: file.file_name, 
            error: error.message,
            storagePath: file.storage_path,
            bucketName
          });
          
          // Try alternative bucket if the primary fails
          if (bucketName === 'order-images') {
            secureLog('Trying alternative bucket: order-deliverables');
            const { data: altData, error: altError } = await supabase.storage
              .from('order-deliverables')
              .download(file.storage_path);
            
            if (altError) {
              secureLog('Alternative bucket also failed:', { 
                fileName: file.file_name, 
                error: altError.message 
              });
              return null;
            }
            
            folder.file(file.file_name, altData);
            secureLog('File downloaded from alternative bucket:', { fileName: file.file_name });
            return file.file_name;
          }
          
          return null;
        }

        if (!data) {
          secureLog('No data returned for file:', { fileName: file.file_name });
          return null;
        }

        // Add file to ZIP folder
        folder.file(file.file_name, data);
        secureLog('File added to ZIP:', { fileName: file.file_name });
        return file.file_name;
      } catch (error) {
        secureLog('Error downloading file for ZIP:', { 
          fileName: file.file_name, 
          error: error instanceof Error ? error.message : 'Unknown error',
          storagePath: file.storage_path
        });
        return null;
      }
    });

    const results = await Promise.all(downloadPromises);
    const successfulFiles = results.filter(Boolean);

    secureLog('Download results:', { 
      successful: successfulFiles.length, 
      total: files.length,
      successfulFiles 
    });

    if (successfulFiles.length === 0) {
      throw new Error('Keine Dateien konnten heruntergeladen werden. Möglicherweise sind die Dateien nicht verfügbar oder der Storage-Bucket ist nicht korrekt konfiguriert.');
    }

    // Generate and download ZIP using native browser API
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${orderNumber}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up object URL
    URL.revokeObjectURL(link.href);

    secureLog('ZIP created successfully:', { 
      orderNumber, 
      filesCount: successfulFiles.length,
      totalFiles: files.length 
    });

  } catch (error) {
    secureLog('ZIP creation failed:', { 
      orderNumber, 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: error
    });
    throw error;
  }
};
