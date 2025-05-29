
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Shield, Info, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadStepProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onNext: () => void;
}

const UploadStep = ({ files, onFilesChange, onNext }: UploadStepProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const supportedFormats = ['jpg', 'jpeg', 'png', 'cr2', 'cr3', 'nef', 'arw', 'dng', 'zip'];
  const maxFileSize = 25 * 1024 * 1024; // 25MB
  const maxFiles = 100;

  const validateFile = (file: File): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !supportedFormats.includes(extension)) {
      toast({
        title: "Ungültiges Format",
        description: `${file.name} wird nicht unterstützt. Bitte laden Sie nur die unterstützten Formate hoch.`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "Datei zu groß",
        description: `${file.name} ist größer als 25 MB. Komprimieren Sie sie oder wählen Sie eine andere Datei.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    if (!newFiles) return;

    const fileArray = Array.isArray(newFiles) ? newFiles : Array.from(newFiles);
    const validFiles = fileArray.filter(validateFile);
    
    // Check for duplicates
    const existingNames = files.map(f => f.name);
    const uniqueFiles = validFiles.filter(file => !existingNames.includes(file.name));
    
    if (uniqueFiles.length !== validFiles.length) {
      toast({
        title: "Duplikate entfernt",
        description: "Einige Dateien waren bereits hochgeladen und wurden übersprungen.",
      });
    }

    const totalFiles = files.length + uniqueFiles.length;

    if (totalFiles > maxFiles) {
      toast({
        title: "Zu viele Dateien",
        description: `Sie können maximal ${maxFiles} Dateien hochladen.`,
        variant: "destructive",
      });
      return;
    }

    if (uniqueFiles.length > 0) {
      onFilesChange([...files, ...uniqueFiles]);
      toast({
        title: "Dateien hochgeladen",
        description: `${uniqueFiles.length} Datei(en) erfolgreich hinzugefügt.`,
      });
    }
  }, [files, onFilesChange, toast]);

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
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Reset the input so the same file can be selected again if needed
      e.target.value = '';
    }
  }, [handleFiles]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    toast({
      title: "Datei entfernt",
      description: "Die Datei wurde aus der Liste entfernt.",
    });
  };

  const canProceed = files.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laden Sie Ihre Bilder hoch</h1>
        <p className="text-gray-600">Wir holen das Beste aus Ihren Fotos – oft genügt schon ein Klick für beeindruckende Ergebnisse.</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dateien hier ablegen oder klicken zum Auswählen
            </h3>
            <p className="text-gray-600 mb-4">
              Unterstützte Formate: JPG, PNG, CR2, CR3, NEF, ARW, DNG, ZIP
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Max 25MB pro Datei, bis zu {maxFiles} Dateien
            </p>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.cr2,.cr3,.nef,.arw,.dng,.zip"
              onChange={handleInputChange}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" type="button">
              Dateien auswählen
            </Button>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Hochgeladene Dateien ({files.length}):
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Upload className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">DSGVO-konforme Verarbeitung</p>
            <p className="text-xs text-green-700">Ihre Bilder bleiben privat und werden vertraulich behandelt.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Pro-Tipp</p>
            <p className="text-xs text-blue-700">Je höher die Auflösung, desto beeindruckender das Ergebnis.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[150px]"
        >
          Weiter zum Paket →
        </Button>
      </div>
    </div>
  );
};

export default UploadStep;
