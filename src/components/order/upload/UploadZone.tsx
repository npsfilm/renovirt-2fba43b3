
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, FileText } from 'lucide-react';

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
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group ${
        dragActive 
          ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' 
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-all duration-300 ${
          dragActive 
            ? 'bg-primary text-primary-foreground scale-110' 
            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
        }`}>
          <Upload className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">
          {dragActive ? 'Dateien hier ablegen' : 'Dateien hier ablegen oder klicken'}
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span>Bilder</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>RAW & ZIP</span>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            {supportedFormats.slice(0, 4).join(', ').toUpperCase()} und weitere
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-6">
          <span>Max {Math.round(maxFileSize / 1024 / 1024)}MB pro Datei</span>
          <span>•</span>
          <span>Bis zu {maxFiles} Dateien</span>
        </div>
        
        <input
          type="file"
          multiple
          accept={supportedFormats.map(format => `.${format}`).join(',')}
          onChange={handleInputChange}
          className="hidden"
          id="file-upload"
        />
        
        <Button 
          variant="outline" 
          type="button"
          className="bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm"
        >
          Dateien auswählen
        </Button>
      </div>
    </div>
  );
};

export default UploadZone;
