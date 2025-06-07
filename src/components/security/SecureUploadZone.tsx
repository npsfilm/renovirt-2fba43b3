
import React, { useCallback } from 'react';
import { validateFileSecurely, enhancedRateLimit } from '@/utils/securityEnhancement';
import { logSecurityEvent } from '@/utils/secureLogging';
import { useToast } from '@/hooks/use-toast';
import { useSecurity } from './EnhancedSecurityProvider';

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
  const { toast } = useToast();
  const { checkPermission } = useSecurity();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check permissions
    if (!checkPermission('file_upload')) {
      toast({
        title: "Upload nicht erlaubt",
        description: "Sie haben keine Berechtigung zum Hochladen von Dateien.",
        variant: "destructive",
      });
      return;
    }

    // Rate limiting
    if (userId && !enhancedRateLimit(`upload_${userId}`, 10, 60000)) {
      logSecurityEvent('file_upload_rate_limited', { userId });
      toast({
        title: "Zu viele Upload-Versuche",
        description: "Bitte warten Sie eine Minute vor dem nächsten Upload.",
        variant: "destructive",
      });
      return;
    }

    // Validate file count
    if (files.length > maxFiles) {
      toast({
        title: "Zu viele Dateien",
        description: `Maximal ${maxFiles} Dateien erlaubt.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    for (const file of Array.from(files)) {
      const validation = validateFileSecurely(file);
      
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.errors.join(', ')}`);
        logSecurityEvent('file_validation_failed', { 
          fileName: file.name, 
          errors: validation.errors,
          userId 
        });
      }
    }

    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: "Datei-Validierung fehlgeschlagen",
        description: errors.slice(0, 3).join('\n') + (errors.length > 3 ? '\n...' : ''),
        variant: "destructive",
      });
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
      
      toast({
        title: "Dateien hochgeladen",
        description: `${validFiles.length} Datei(en) erfolgreich validiert und hochgeladen.`,
      });
    }

    // Clear input
    event.target.value = '';
  }, [onFiles, maxFiles, userId, toast, checkPermission]);

  return (
    <div className={className}>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/tiff,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="secure-file-input"
      />
      <label htmlFor="secure-file-input" style={{ cursor: 'pointer', display: 'block' }}>
        {children}
      </label>
    </div>
  );
};

export default SecureUploadZone;
