
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface BracketingInfoCardProps {
  selectedType: 'bracketing-3' | 'bracketing-5';
}

const BracketingInfoCard = ({ selectedType }: BracketingInfoCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-info/5 to-info/10 border-info/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-info" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground mb-2">Bracketing-Information</h4>
            <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
              {selectedType === 'bracketing-3' 
                ? 'Ihre hochgeladenen Bilder werden automatisch in 3er-Gruppen für HDR-Verarbeitung gruppiert.'
                : 'Ihre hochgeladenen Bilder werden automatisch in 5er-Gruppen für HDR-Verarbeitung gruppiert.'
              }
            </p>
            <div className="bg-info/10 rounded-lg p-3">
              <p className="text-sm text-info/80 font-medium">
                Die Anzahl der Bilder für die Preisberechnung wird basierend auf den resultierenden HDR-Bildern angepasst. 
                Z.B. 6 Bilder mit 3er-Reihen ergeben 2 finale HDR-Bilder.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BracketingInfoCard;
