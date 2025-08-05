
import React from 'react';
import { Upload, Image, FileImage } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  const formatFileSize = (bytes: number) => {
    return Math.round(bytes / 1024 / 1024);
  };

  if (isMobile) {
    // Airbnb-style mobile upload zone
    return (
      <SecureUploadZone 
        onFiles={onFiles} 
        maxFiles={maxFiles}
        userId={user?.id}
        className="w-full"
      >
        <div className="relative border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-primary/60 transition-all duration-300 cursor-pointer bg-white hover:bg-primary/5 group">
          {/* Main content */}
          <div className="space-y-6">
            {/* Enhanced icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-300 shadow-lg">
                <div className="relative">
                  <Upload className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced text content */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                Fotos hinzufügen
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                Tippen Sie hier oder ziehen Sie Ihre Bilder hierher
              </p>
              
              {/* Airbnb-style action button */}
              <div className="pt-4">
                <div className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-200 active:scale-95 shadow-sm">
                  Durchsuchen
                </div>
              </div>
            </div>

            {/* Enhanced file info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                {supportedFormats.slice(0, 3).join(', ').toUpperCase()}{supportedFormats.length > 3 ? ' +' : ''} bis {formatFileSize(maxFileSize)}MB
              </p>
            </div>
          </div>

          {/* Airbnb-style hover effect overlay */}
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-300 pointer-events-none"></div>
        </div>
      </SecureUploadZone>
    );
  }

  // Desktop version remains unchanged
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
