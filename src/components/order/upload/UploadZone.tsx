
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFiles: (files: FileList) => void;
  supportedFormats: string[];
  maxFileSize: number;
  maxFiles: number;
}

const UploadZone = ({ onFiles, supportedFormats, maxFileSize, maxFiles }: UploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [onFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(e.target.files);
      e.target.value = '';
    }
  }, [onFiles]);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        Dateien hier ablegen oder klicken zum Auswählen
      </h3>
      <p className="text-muted-foreground mb-4">
        Unterstützte Formate: {supportedFormats.join(', ').toUpperCase()}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Max {Math.round(maxFileSize / 1024 / 1024)}MB pro Datei, bis zu {maxFiles} Dateien
      </p>
      <input
        type="file"
        multiple
        accept={supportedFormats.map(format => `.${format}`).join(',')}
        onChange={handleInputChange}
        className="hidden"
        id="file-upload"
      />
      <Button variant="outline" type="button">
        Dateien auswählen
      </Button>
    </div>
  );
};

export default UploadZone;
