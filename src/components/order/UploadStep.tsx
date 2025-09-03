
import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import UploadZone from './upload/UploadZone';
import FileList from './upload/FileList';
import UploadInfo from './upload/UploadInfo';
import BracketingInfo from './upload/BracketingInfo';
import UploadStepActions from './upload/UploadStepActions';
import { useOrderStore } from '@/stores/orderStore';

interface UploadStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const UploadStep = ({ onNext, onPrev }: UploadStepProps) => {
  const files = useOrderStore((state) => state.files);
  const photoType = useOrderStore((state) => state.photoType);
  const addFiles = useOrderStore((state) => state.addFiles);
  const removeFile = useOrderStore((state) => state.removeFile);
  const supportedFormats = ['jpg', 'jpeg', 'png', 'cr2', 'cr3', 'nef', 'arw', 'dng', 'zip'];
  const maxFileSize = 25 * 1024 * 1024; // 25MB
  const maxFiles = 100;

  // Calculate effective photos based on bracketing
  const getEffectivePhotoCount = useCallback((fileCount: number): number => {
    if (photoType === 'bracketing-3') {
      return Math.floor(fileCount / 3);
    } else if (photoType === 'bracketing-5') {
      return Math.floor(fileCount / 5);
    }
    return fileCount;
  }, [photoType]);

  const getBracketingDivisor = useCallback((): number => {
    if (photoType === 'bracketing-3') return 3;
    if (photoType === 'bracketing-5') return 5;
    return 1;
  }, [photoType]);

  const validateFile = useCallback((file: File): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !supportedFormats.includes(extension)) {
      return false;
    }
    if (file.size > maxFileSize) {
      return false;
    }
    return true;
  }, [maxFileSize, supportedFormats]);

  const handleFiles = useCallback((newFiles: FileList) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(validateFile);

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      return;
    }

    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  }, [files.length, addFiles, validateFile, maxFiles]);

  const canProceed = files.length > 0;
  const effectivePhotos = getEffectivePhotoCount(files.length);
  const bracketingDivisor = getBracketingDivisor();
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-3 px-2'}`}>
      {!isMobile && (
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Laden Sie Ihre Bilder hoch</h1>
        </div>
      )}

      <div className={`${isMobile ? 'px-6' : ''}`}>
        <BracketingInfo photoType={photoType} bracketingDivisor={bracketingDivisor} />
      </div>

      <Card className={`${isMobile ? 'mx-0 shadow-2xl border-0 rounded-none' : 'border-0 md:border rounded-none md:rounded-lg'}`}>
        <CardContent className={`${isMobile ? 'p-6' : 'p-3 md:p-6'}`}>
          <UploadZone onFiles={handleFiles} supportedFormats={supportedFormats} maxFileSize={maxFileSize} maxFiles={maxFiles} />

          <FileList files={files} onRemoveFile={removeFile} photoType={photoType} bracketingDivisor={bracketingDivisor} effectivePhotos={effectivePhotos} />
        </CardContent>
      </Card>

      <div className={`${isMobile ? 'px-6' : ''}`}>
        <UploadInfo />
      </div>

      {/* Desktop Actions - hidden on mobile */}
      <div className="hidden md:block">
        <UploadStepActions onPrev={onPrev} onNext={onNext} canProceed={canProceed} />
      </div>
    </div>
  );
};

export default UploadStep;
