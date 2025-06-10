
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

    // Check if files exist first
    const existenceChecks = files.map(async (file) => {
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .list(file.storage_path.split('/').slice(0, -1).join('/'), {
            search: file.storage_path.split('/').pop()
          });
        
        if (error) {
          secureLog('File existence check failed:', { 
            fileName: file.file_name, 
            error: error.message,
            storagePath: file.storage_path 
          });
          return { file, exists: false, error: error.message };
        }
        
        const exists = data && data.length > 0;
        secureLog('File existence check:', { 
          fileName: file.file_name, 
          exists,
          foundFiles: data?.map(f => f.name) || []
        });
        
        return { file, exists, error: null };
      } catch (error) {
        secureLog('File existence check error:', { 
          fileName: file.file_name, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        return { file, exists: false, error: 'Check failed' };
      }
    });

    const existenceResults = await Promise.all(existenceChecks);
    const existingFiles = existenceResults.filter(result => result.exists).map(result => result.file);
    
    secureLog('File existence results:', { 
      total: files.length,
      existing: existingFiles.length,
      missing: files.length - existingFiles.length
    });

    if (existingFiles.length === 0) {
      throw new Error('Keine der Dateien konnte im Storage gefunden werden. Möglicherweise wurden sie verschoben oder gelöscht.');
    }

    // Download existing files and add them to the ZIP
    const downloadPromises = existingFiles.map(async (file) => {
      try {
        secureLog('Attempting to download file:', { 
          fileName: file.file_name, 
          storagePath: file.storage_path,
          bucketName 
        });

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
      total: existingFiles.length,
      successfulFiles 
    });

    if (successfulFiles.length === 0) {
      throw new Error('Keine Dateien konnten heruntergeladen werden, obwohl sie im Storage vorhanden zu sein scheinen.');
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
