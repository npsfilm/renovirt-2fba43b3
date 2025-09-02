
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';

interface BracketingInfoCardProps {
  selectedType: 'bracketing-3' | 'bracketing-5';
}

const BracketingInfoCard = ({ selectedType }: BracketingInfoCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-info/5 to-info/10 border-info/20 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-info/10 rounded-lg flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-info" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-foreground mb-1">Bracketing-Information</h4>
            <p className="text-muted-foreground text-[11px] leading-tight">
              Bilder werden in {selectedType === 'bracketing-3' ? '3er' : '5er'}-Gruppen für HDR gruppiert. 
              Preisberechnung basiert auf finalen HDR-Bildern.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BracketingInfoCard;
