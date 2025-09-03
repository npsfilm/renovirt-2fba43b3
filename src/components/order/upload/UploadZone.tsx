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
const UploadZone = ({
  onFiles,
  supportedFormats,
  maxFileSize,
  maxFiles
}: UploadZoneProps) => {
  const {
    user
  } = useAuth();
  const isMobile = useIsMobile();
  const formatFileSize = (bytes: number) => {
    return Math.round(bytes / 1024 / 1024);
  };
  if (isMobile) {
    // Airbnb-style mobile upload zone
    return <SecureUploadZone onFiles={onFiles} maxFiles={maxFiles} userId={user?.id} className="w-full">
        <div className="relative border-2 border-dashed border-gray-300 rounded-3xl p-5 text-center hover:border-primary/60 transition-all duration-300 cursor-pointer bg-white hover:bg-primary/5 group">
          {/* Main content */}
          <div className="space-y-4">
            {/* Enhanced icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-all duration-300 shadow-sm">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/f217e090-3a69-475a-8aad-bc893e8ac871.png" 
                    alt="Upload" 
                    className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
              </div>
            </div>

            {/* Enhanced text content - mobile optimized */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Bilder hochladen
              </h3>
              <p className="text-sm text-gray-600 leading-snug px-2">
                Antippen zum Auswählen
              </p>
              
              {/* Compact action button */}
              <div className="pt-2">
                <div className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-900 rounded-xl text-sm text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-all duration-200 active:scale-95 shadow-sm">
                  Auswählen
                </div>
              </div>
            </div>

            {/* Compact file info */}
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                JPG, PNG, RAW bis {formatFileSize(maxFileSize)}MB
              </p>
            </div>
          </div>

          {/* Airbnb-style hover effect overlay */}
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-300 pointer-events-none"></div>
        </div>
      </SecureUploadZone>;
  }

  // Desktop version remains unchanged
  return <SecureUploadZone onFiles={onFiles} maxFiles={maxFiles} userId={user?.id} className="w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/f217e090-3a69-475a-8aad-bc893e8ac871.png" 
              alt="Upload" 
              className="h-24 w-24" 
            />
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
    </SecureUploadZone>;
};
export default UploadZone;