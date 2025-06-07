
import React from 'react';
import { Upload, Image, FileImage } from 'lucide-react';
import SecureUploadZone from '@/components/security/SecureUploadZone';
import { useAuth } from '@/hooks/useAuth';

interface UploadZoneProps {
  onFiles: (files: FileList) => void;
  supportedFormats: string[];
  maxFileSize: number;
  maxFiles: number;
}

const UploadZone = ({ onFiles, supportedFormats, maxFileSize, maxFiles }: UploadZoneProps) => {
  const { user } = useAuth();

  const formatFileSize = (bytes: number) => {
    return Math.round(bytes / 1024 / 1024);
  };

  return (
    <SecureUploadZone 
      onFiles={onFiles} 
      maxFiles={maxFiles}
      userId={user?.id}
      className="w-full"
    >
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <Upload className="h-12 w-12 text-gray-400" />
            <Image className="h-12 w-12 text-blue-500" />
            <FileImage className="h-12 w-12 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Klicken Sie hier oder ziehen Sie Ihre Bilder hinein
            </h3>
            <p className="text-sm text-gray-600">
              Unterstützte Formate: {supportedFormats.join(', ').toUpperCase()}
            </p>
            <p className="text-sm text-gray-500">
              Max. {formatFileSize(maxFileSize)} MB pro Datei • Bis zu {maxFiles} Dateien
            </p>
          </div>
        </div>
      </div>
    </SecureUploadZone>
  );
};

export default UploadZone;
