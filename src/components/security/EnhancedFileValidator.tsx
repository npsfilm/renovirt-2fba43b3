
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, FileX, Shield } from 'lucide-react';

interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
}

interface EnhancedFileValidatorProps {
  file: File;
  onValidationComplete: (result: FileValidationResult) => void;
}

const EnhancedFileValidator = ({ file, onValidationComplete }: EnhancedFileValidatorProps) => {
  const [validationResult, setValidationResult] = React.useState<FileValidationResult | null>(null);

  const validateFile = React.useCallback(async (file: File) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Erweiterte Dateityp-Validierung
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/tif',
      'image/webp', 'image/bmp', 'image/heic', 'image/heif'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Ungültiger Dateityp: ${file.type}. Erlaubt sind nur Bilddateien.`);
    }

    // Dateigröße-Validierung (100MB Maximum)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`Datei ist zu groß: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 100MB`);
    }

    // Warnung für sehr große Dateien
    const warningSize = 50 * 1024 * 1024;
    if (file.size > warningSize && file.size <= maxSize) {
      warnings.push(`Große Datei: ${(file.size / 1024 / 1024).toFixed(1)}MB. Upload kann länger dauern.`);
    }

    // Dateiname-Validierung
    const dangerousChars = /[<>:"/\\|?*\x00-\x1f]/;
    if (dangerousChars.test(file.name)) {
      errors.push('Dateiname enthält ungültige Zeichen.');
    }

    // Minimum-Dateigröße
    if (file.size < 1024) {
      errors.push('Datei ist zu klein (unter 1KB).');
    }

    // Erweiterte Sicherheitsprüfungen
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
    const fileName = file.name.toLowerCase();
    const hasSuspiciousExtension = suspiciousExtensions.some(ext => 
      fileName.includes(ext)
    );
    
    if (hasSuspiciousExtension) {
      errors.push('Datei enthält verdächtige Dateierweiterungen.');
    }

    // Prüfe auf Doppel-Extensions
    const extensionCount = (file.name.match(/\./g) || []).length;
    if (extensionCount > 1) {
      warnings.push('Datei hat mehrere Dateierweiterungen. Prüfen Sie die Datei auf Verdacht.');
    }

    const result: FileValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    };

    setValidationResult(result);
    onValidationComplete(result);
  }, [onValidationComplete]);

  React.useEffect(() => {
    if (file) {
      validateFile(file);
    }
  }, [file, validateFile]);

  if (!validationResult) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 animate-spin" />
            <span>Validiere Datei...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${
      validationResult.isValid 
        ? 'border-green-200 bg-green-50' 
        : 'border-red-200 bg-red-50'
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm flex items-center gap-2 ${
          validationResult.isValid ? 'text-green-700' : 'text-red-700'
        }`}>
          {validationResult.isValid ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <FileX className="w-4 h-4" />
          )}
          Datei-Validierung
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-xs text-gray-600">
            <p><strong>Name:</strong> {validationResult.fileInfo.name}</p>
            <p><strong>Größe:</strong> {(validationResult.fileInfo.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Typ:</strong> {validationResult.fileInfo.type}</p>
          </div>

          {validationResult.errors.length > 0 && (
            <div className="space-y-1">
              {validationResult.errors.map((error, index) => (
                <div key={index} className="flex items-start gap-2 text-red-700 text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          {validationResult.warnings.length > 0 && (
            <div className="space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2 text-orange-700 text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}

          {validationResult.isValid && validationResult.errors.length === 0 && (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Datei ist gültig und sicher</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedFileValidator;
