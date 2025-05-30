
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from './secureLogging';

export const downloadFile = async (bucketName: string, filePath: string, fileName: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      throw error;
    }

    // Create blob URL and trigger download
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    secureLog('File downloaded successfully:', { fileName });
  } catch (error) {
    secureLog('File download failed:', error);
    throw error;
  }
};

export const getFileUrl = async (bucketName: string, filePath: string) => {
  try {
    const { data } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl;
  } catch (error) {
    secureLog('Failed to get file URL:', error);
    return null;
  }
};
