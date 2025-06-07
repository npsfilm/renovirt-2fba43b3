
import React from 'react';
import { Info } from 'lucide-react';

interface BracketingInfoProps {
  photoType?: string;
  bracketingDivisor: number;
}

const BracketingInfo = ({ photoType, bracketingDivisor }: BracketingInfoProps) => {
  if (!photoType?.startsWith('bracketing')) return null;

  return (
    <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-warning mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-foreground">Bracketing-Modus aktiv</h4>
          <p className="text-sm text-muted-foreground">
            Stellen Sie sicher, dass Sie Ihre Bilder in {bracketingDivisor}er-Gruppen hochladen. 
            Jede Gruppe wird zu einem HDR-Bild verarbeitet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BracketingInfo;
