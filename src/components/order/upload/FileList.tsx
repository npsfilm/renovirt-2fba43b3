
import React, { useEffect, useState } from 'react';
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


  // Bildgrößenanalyse (längste Seite, farbliche Bewertung)
  type ImageInfo = { longest: number | null; level: 'red' | 'orange' | 'green' | 'unknown'; note: string; isRaw: boolean };
  const [infos, setInfos] = useState<ImageInfo[]>([]);

  const rawExtensions = new Set(['cr2','nef','arw','raf','dng','rw2','orf','srw','pef','3fr','kdc','erf','heic','heif']);
  const isRawFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (rawExtensions.has(ext)) return true;
    if (!file.type || !file.type.startsWith('image/')) return true;
    return false;
  };

  const getImageDimensions = (file: File) => new Promise<{ width: number; height: number } | null>((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const res = { width: img.naturalWidth || (img as any).width, height: img.naturalHeight || (img as any).height };
        URL.revokeObjectURL(url);
        resolve(res);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    } catch {
      resolve(null);
    }
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const results = await Promise.all(files.map(async (file) => {
        if (isRawFile(file)) {
          return { longest: null, level: 'unknown' as const, note: 'RAW‑Datei: Beste Datenqualität, Abmessungen können nicht ausgelesen werden.', isRaw: true };
        }
        const dims = await getImageDimensions(file);
        if (!dims) {
          return { longest: null, level: 'unknown' as const, note: 'Abmessungen konnten nicht ermittelt werden.', isRaw: false };
        }
        const longest = Math.max(dims.width, dims.height);
        let level: ImageInfo['level'] = 'green';
        let note = `Optimal: längste Seite ${longest}px (≥ 3000px).`;
        if (longest < 1920) { level = 'red'; note = `Auflösung niedrig: längste Seite ${longest}px (empfohlen ≥ 1920px).`; }
        else if (longest < 3000) { level = 'orange'; note = `Ausreichend: längste Seite ${longest}px (≥ 1920px).`; }
        return { longest, level, note, isRaw: false };
      }));
      if (mounted) setInfos(results);
    })();
    return () => { mounted = false; };
  }, [files]);

  const getBadgeClasses = (level: ImageInfo['level']) => {
    switch (level) {
      case 'red': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'orange': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'green': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default: return 'bg-muted/40 text-muted-foreground border-border/50';
    }
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
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  <div className={`text-[11px] px-2 py-0.5 rounded-full border ${getBadgeClasses(infos[index]?.level || 'unknown')}`}>
                    {infos[index]?.isRaw ? 'RAW – beste Daten' : (infos[index]?.note || 'Prüfung läuft…')}
                  </div>
                </div>
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
