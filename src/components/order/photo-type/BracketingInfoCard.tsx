import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';
interface BracketingInfoCardProps {
  selectedType: 'bracketing-3' | 'bracketing-5';
}
const BracketingInfoCard = ({
  selectedType
}: BracketingInfoCardProps) => {
  return <Card className="bg-gradient-to-r from-info/5 to-info/10 border-info/20 shadow-sm">
      <CardContent className="p-3 md:p-4">
        <h4 className="text-sm font-semibold text-foreground mb-1">Bracketing-Information</h4>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          {selectedType === 'bracketing-3' 
            ? 'Bilder werden in 3er-Gruppen für HDR-Verarbeitung gruppiert. Die Preisberechnung erfolgt basierend auf den resultierenden HDR-Bildern (z.B. 6 Bilder = 2 finale HDR-Bilder).' 
            : 'Bilder werden in 5er-Gruppen für HDR-Verarbeitung gruppiert. Die Preisberechnung erfolgt basierend auf den resultierenden HDR-Bildern (z.B. 10 Bilder = 2 finale HDR-Bilder).'}
        </p>
      </CardContent>
    </Card>;
};
export default BracketingInfoCard;