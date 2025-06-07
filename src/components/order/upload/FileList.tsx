
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image, FileText, Package } from 'lucide-react';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  photoType?: string;
  bracketingDivisor: number;
  effectivePhotos: number;
}

const FileList = ({ files, onRemoveFile, photoType, bracketingDivisor, effectivePhotos }: FileListProps) => {
  if (files.length === 0) return null;

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4 text-blue-600" />;
    if (file.name.toLowerCase().endsWith('.zip')) return <Package className="w-4 h-4 text-purple-600" />;
    return <FileText className="w-4 h-4 text-green-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-foreground tracking-tight">
          Hochgeladene Dateien
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({files.length} {files.length === 1 ? 'Datei' : 'Dateien'})
          </span>
        </h4>
        
        {photoType?.startsWith('bracketing') && (
          <div className="flex items-center gap-4 text-sm">
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {effectivePhotos} HDR {effectivePhotos === 1 ? 'Bild' : 'Bilder'}
            </div>
            {files.length % bracketingDivisor !== 0 && (
              <div className="px-3 py-1 bg-warning/10 text-warning rounded-full font-medium">
                {files.length % bracketingDivisor} unvollständig
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`} 
            className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-muted/30 hover:border-primary/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                {getFileIcon(file)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  {file.type && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground uppercase">
                        {file.type.split('/')[1] || file.name.split('.').pop()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(index)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 ml-2"
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
