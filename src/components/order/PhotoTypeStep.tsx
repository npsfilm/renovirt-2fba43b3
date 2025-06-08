
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import PhotoTypeCard from './photo-type/PhotoTypeCard';
import BracketingInfoCard from './photo-type/BracketingInfoCard';
import ProTipCard from './photo-type/ProTipCard';
import { photoTypes } from './photo-type/photoTypeData';

interface PhotoTypeStepProps {
  selectedType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  onTypeChange: (type: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5') => void;
  onNext: () => void;
}

const PhotoTypeStep = ({ selectedType, onTypeChange, onNext }: PhotoTypeStepProps) => {
  const canProceed = selectedType !== undefined;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Wählen Sie Ihren Foto-Typ</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung und beste Ergebnisse.
        </p>
      </div>

      <RadioGroup
        value={selectedType}
        onValueChange={onTypeChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {photoTypes.map((type) => (
          <PhotoTypeCard
            key={type.id}
            id={type.id}
            title={type.title}
            description={type.description}
            icon={type.icon}
            isSelected={selectedType === type.id}
          />
        ))}
      </RadioGroup>

      {selectedType?.startsWith('bracketing') && (
        <BracketingInfoCard selectedType={selectedType as 'bracketing-3' | 'bracketing-5'} />
      )}

      <ProTipCard />

      <div className="flex justify-end pt-4">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          size="lg"
          className="min-w-[180px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
        >
          Weiter zum Upload →
        </Button>
      </div>
    </div>
  );
};

export default PhotoTypeStep;
