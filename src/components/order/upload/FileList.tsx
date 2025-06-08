
import React from 'react';
import { X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  photoType?: string;
  bracketingDivisor: number;
  effectivePhotos: number;
}

const FileList = ({ files, onRemoveFile, photoType, bracketingDivisor, effectivePhotos }: FileListProps) => {
  if (files.length === 0) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Hochgeladene Dateien ({files.length})</h3>
        {photoType?.startsWith('bracketing') && (
          <div className="text-sm text-muted-foreground">
            {effectivePhotos} HDR-Bilder aus {files.length} Dateien
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <FileImage className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              {photoType?.startsWith('bracketing') && (
                <div className="text-xs text-muted-foreground">
                  Gruppe {Math.floor(index / bracketingDivisor) + 1}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(index)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
