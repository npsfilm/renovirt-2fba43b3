import React, { useCallback } from 'react';
import { validateFileSecurely, enhancedRateLimit } from '@/utils/securityEnhancement';
import { logSecurityEvent } from '@/utils/secureLogging';
import { useSecurityContext } from './EnhancedSecurityProvider';

interface SecureUploadZoneProps {
  onFiles: (files: FileList) => void;
  maxFiles?: number;
  userId?: string;
  className?: string;
  children: React.ReactNode;
}

const SecureUploadZone = ({ 
  onFiles, 
  maxFiles = 100, 
  userId, 
  className,
  children 
}: SecureUploadZoneProps) => {
  const { reportSecurityIncident } = useSecurityContext();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Log security attempt
    reportSecurityIncident('file_upload_attempt', { 
      fileCount: files.length, 
      userId 
    });

    // Rate limiting
    if (userId && !enhancedRateLimit(`upload_${userId}`, 10, 60000)) {
      logSecurityEvent('file_upload_rate_limited', { userId });
      return;
    }

    // Validate file count
    if (files.length > maxFiles) {
      return;
    }

    const validFiles: File[] = [];

    // Validate each file
    for (const file of Array.from(files)) {
      const validation = validateFileSecurely(file);
      
      if (validation.valid) {
        validFiles.push(file);
      } else {
        logSecurityEvent('file_validation_failed', { 
          fileName: file.name, 
          errors: validation.errors,
          userId 
        });
      }
    }

    // Process valid files
    if (validFiles.length > 0) {
      const fileList = new DataTransfer();
      validFiles.forEach(file => fileList.items.add(file));
      
      logSecurityEvent('secure_file_upload_success', { 
        fileCount: validFiles.length,
        userId 
      });
      
      onFiles(fileList.files);
    }

    // Clear input
    event.target.value = '';
  }, [onFiles, maxFiles, userId, reportSecurityIncident]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a synthetic event for the file handler
      const syntheticEvent = {
        target: { files, value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      
      await handleFileSelect(syntheticEvent);
    }
  }, [handleFileSelect]);

  return (
    <div className={className}>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/tiff,image/webp,application/zip"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="secure-file-input"
      />
      <label 
        htmlFor="secure-file-input" 
        style={{ cursor: 'pointer', display: 'block' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {children}
      </label>
    </div>
  );
};

export default SecureUploadZone;
