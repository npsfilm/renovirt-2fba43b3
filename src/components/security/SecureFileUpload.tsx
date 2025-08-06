
import React, { useCallback } from 'react';
import { validateAndSanitizeText, checkRateLimit } from '@/utils/enhancedInputValidation';
import { secureLog } from '@/utils/secureLogging';

interface SecureFileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  userId?: string;
}

const SecureFileUpload = ({ 
  onFileSelect, 
  acceptedTypes, 
  maxFileSize, 
  maxFiles,
  userId 
}: SecureFileUploadProps) => {

  const validateFileType = (file: File): boolean => {
    // Check file extension
    const extension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = acceptedTypes.map(type => type.replace('image/', ''));
    
    if (!extension || !allowedExtensions.includes(extension)) {
      return false;
    }

    // Check MIME type
    if (!acceptedTypes.includes(file.type)) {
      return false;
    }

    return true;
  };

  const validateFileSignature = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer.slice(0, 8));
        
        // Common image file signatures
        const signatures = {
          'image/jpeg': [[0xFF, 0xD8, 0xFF]],
          'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
          'image/gif': [[0x47, 0x49, 0x46, 0x38], [0x47, 0x49, 0x46, 0x39]],
          'image/webp': [[0x52, 0x49, 0x46, 0x46]]
        };

        const fileSignatures = signatures[file.type as keyof typeof signatures];
        if (!fileSignatures) {
          resolve(false);
          return;
        }

        const isValid = fileSignatures.some(signature => 
          signature.every((byte, index) => bytes[index] === byte)
        );
        
        resolve(isValid);
      };
      reader.readAsArrayBuffer(file.slice(0, 8));
    });
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Rate limiting
    if (userId && !checkRateLimit(`file_upload_${userId}`, 10, 60000)) {
      secureLog('File upload rate limit exceeded', { userId });
      return;
    }

    // Validate file count
    if (files.length > maxFiles) {
      return;
    }

    const validFiles: File[] = [];
    
    for (const file of files) {
      // Validate file size
      if (file.size > maxFileSize) {
        continue;
      }

      // Sanitize filename
      const sanitizedName = validateAndSanitizeText(file.name, 100);
      if (sanitizedName !== file.name) {
        secureLog('Suspicious filename detected', { 
          original: file.name, 
          sanitized: sanitizedName,
          userId 
        });
      }

      // Validate file type
      if (!validateFileType(file)) {
        continue;
      }

      // Additional validation for file signature
      const isValidSignature = await validateFileSignature(file);
      if (!isValidSignature) {
        secureLog('Invalid file signature detected', { 
          fileName: file.name, 
          type: file.type,
          userId 
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }

    // Clear input
    event.target.value = '';
  }, [onFileSelect, acceptedTypes, maxFileSize, maxFiles, userId]);

  return (
    <input
      type="file"
      multiple
      accept={acceptedTypes.join(',')}
      onChange={handleFileSelect}
      style={{ display: 'none' }}
    />
  );
};

export default SecureFileUpload;
