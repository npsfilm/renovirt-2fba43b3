
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  photoType?: string;
  bracketingDivisor: number;
  effectivePhotos: number;
}

const FileList = ({ files, onRemoveFile, photoType, bracketingDivisor, effectivePhotos }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground">
          Hochgeladene Dateien ({files.length}):
        </h4>
        {photoType?.startsWith('bracketing') && (
          <div className="text-sm text-muted-foreground">
            Effektive Fotos: <span className="font-medium text-foreground">{effectivePhotos}</span>
            {files.length % bracketingDivisor !== 0 && (
              <span className="text-warning ml-2">
                ({files.length % bracketingDivisor} unvollständige Gruppe)
              </span>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {files.map((file, index) => (
          <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <Upload className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
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
