
import React from 'react';
import { Info, Camera, Layers } from 'lucide-react';

interface BracketingInfoProps {
  photoType?: string;
  bracketingDivisor: number;
}

const BracketingInfo = ({ photoType, bracketingDivisor }: BracketingInfoProps) => {
  if (!photoType?.startsWith('bracketing')) return null;

  return (
    <div className="bg-gradient-to-r from-warning/5 to-orange/5 border border-warning/20 rounded-xl p-6 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Layers className="w-5 h-5 text-warning" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-base font-semibold text-foreground tracking-tight">
              HDR Bracketing-Modus
            </h4>
            <div className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded">
              {bracketingDivisor}er-Gruppen
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Laden Sie Ihre Bilder in {bracketingDivisor}er-Gruppen hoch. Jede vollständige Gruppe wird zu einem 
            hochwertigen HDR-Bild verarbeitet, das eine verbesserte Dynamik und Detailreichtum bietet.
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Camera className="w-3 h-3" />
              <span>Verschiedene Belichtungen</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="w-3 h-3" />
              <span>Automatische HDR-Fusion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BracketingInfo;
