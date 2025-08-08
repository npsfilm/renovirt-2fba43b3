
import React, { useEffect, useState } from 'react';
import { X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
const isRawFile = (file?: File | null) => {
  const name = (file as any)?.name as string | undefined;
  const ext = name && name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  const type = (file as any)?.type as string | undefined;
  if (ext && rawExtensions.has(ext)) return true;
  if (!type || !type.startsWith?.('image/')) return true;
  return false;
};

// Vorschaubilder für Bilddateien
const [previews, setPreviews] = useState<(string | null)[]>([]);

useEffect(() => {
  const urls = files.map((f) =>
    !isRawFile(f) && (f as any)?.type?.startsWith?.('image/') ? URL.createObjectURL(f) : null
  );
  setPreviews(urls);
  return () => {
    urls.forEach((u) => { if (u) URL.revokeObjectURL(u); });
  };
}, [files]);

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
          if (!file) {
            return { longest: null, level: 'unknown' as const, note: 'Datei konnte nicht gelesen werden.', isRaw: false };
          }
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="rounded-lg border bg-muted/30 overflow-hidden">
            {previews[index] ? (
              <AspectRatio ratio={4/3}>
                <img
                  src={previews[index] as string}
                  alt={`Hochgeladene Bildvorschau – ${file.name}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </AspectRatio>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                <FileImage className="w-8 h-8" />
              </div>
            )}
            <div className="p-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  <div className={`text-[11px] px-2 py-0.5 rounded-full border ${getBadgeClasses(infos[index]?.level || 'unknown')}`}>
                    {infos[index]?.isRaw ? 'RAW – beste Daten' : (infos[index]?.note || 'Prüfung läuft…')}
                  </div>
                  {photoType?.startsWith('bracketing') && (
                    <span className="text-xs text-muted-foreground">
                      Gruppe {Math.floor(index / bracketingDivisor) + 1}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Datei entfernen"
                title="Datei entfernen"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
