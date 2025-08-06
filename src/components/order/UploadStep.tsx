
import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import UploadZone from './upload/UploadZone';
import FileList from './upload/FileList';
import UploadInfo from './upload/UploadInfo';
import BracketingInfo from './upload/BracketingInfo';
import UploadStepActions from './upload/UploadStepActions';

interface UploadStepProps {
  files: File[];
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  onFilesChange: (files: File[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

const UploadStep = ({
  files,
  photoType,
  onFilesChange,
  onNext,
  onPrev
}: UploadStepProps) => {
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

    // Check for duplicates
    const existingNames = files.map(f => f.name);
    const uniqueFiles = validFiles.filter(file => !existingNames.includes(file.name));

    const totalFiles = files.length + uniqueFiles.length;
    if (totalFiles > maxFiles) {
      return;
    }

    if (uniqueFiles.length > 0) {
      onFilesChange([...files, ...uniqueFiles]);
    }
  }, [files, onFilesChange, validateFile, maxFiles]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

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
