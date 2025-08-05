import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
  const {
    toast
  } = useToast();
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
      toast({
        title: "Ungültiges Format",
        description: `${file.name} wird nicht unterstützt. Bitte laden Sie nur die unterstützten Formate hoch.`,
        variant: "destructive"
      });
      return false;
    }
    if (file.size > maxFileSize) {
      toast({
        title: "Datei zu groß",
        description: `${file.name} ist größer als 25 MB. Komprimieren Sie sie oder wählen Sie eine andere Datei.`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, [toast, maxFileSize, supportedFormats]);
  const handleFiles = useCallback((newFiles: FileList) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(validateFile);

    // Check for duplicates
    const existingNames = files.map(f => f.name);
    const uniqueFiles = validFiles.filter(file => !existingNames.includes(file.name));
    if (uniqueFiles.length !== validFiles.length) {
      toast({
        title: "Duplikate entfernt",
        description: "Einige Dateien waren bereits hochgeladen und wurden übersprungen."
      });
    }
    const totalFiles = files.length + uniqueFiles.length;
    if (totalFiles > maxFiles) {
      toast({
        title: "Zu viele Dateien",
        description: `Sie können maximal ${maxFiles} Dateien hochladen.`,
        variant: "destructive"
      });
      return;
    }
    if (uniqueFiles.length > 0) {
      onFilesChange([...files, ...uniqueFiles]);
      toast({
        title: "Dateien hochgeladen",
        description: `${uniqueFiles.length} Datei(en) erfolgreich hinzugefügt.`
      });
    }
  }, [files, onFilesChange, toast, validateFile, maxFiles]);
  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    toast({
      title: "Datei entfernt",
      description: "Die Datei wurde aus der Liste entfernt."
    });
  }, [files, onFilesChange, toast]);
  const canProceed = files.length > 0;
  const effectivePhotos = getEffectivePhotoCount(files.length);
  const bracketingDivisor = getBracketingDivisor();
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-4 md:space-y-6 px-2 md:px-4'}`}>
      {!isMobile && (
        <div className="text-center space-y-2 md:space-y-3">
          <h1 className="text-xl md:text-3xl font-semibold text-foreground tracking-tight">Laden Sie Ihre Bilder hoch</h1>
        </div>
      )}

      <div className={`${isMobile ? 'px-4' : ''}`}>
        <BracketingInfo photoType={photoType} bracketingDivisor={bracketingDivisor} />
      </div>

      <Card className={`${isMobile ? 'mx-0 shadow-lg border-0 rounded-none' : 'border-0 md:border rounded-none md:rounded-lg'}`}>
        <CardContent className={`${isMobile ? 'p-4' : 'p-4 md:p-8'}`}>
          <UploadZone onFiles={handleFiles} supportedFormats={supportedFormats} maxFileSize={maxFileSize} maxFiles={maxFiles} />

          <FileList files={files} onRemoveFile={removeFile} photoType={photoType} bracketingDivisor={bracketingDivisor} effectivePhotos={effectivePhotos} />
        </CardContent>
      </Card>

      <div className={`${isMobile ? 'px-4' : ''}`}>
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