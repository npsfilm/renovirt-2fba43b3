
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
}

const PhotoTypeStep = ({ selectedType, onTypeChange }: PhotoTypeStepProps) => {
  const canProceed = selectedType !== undefined;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Compact Header - mobile optimized */}
      <div className="text-center space-y-2 px-2 md:px-4 py-4 md:py-8 flex-shrink-0">
        <h1 className="text-xl md:text-3xl font-semibold text-foreground tracking-tight">Wählen Sie Ihren Foto-Typ</h1>
        <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung.
        </p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 px-2 md:px-4 overflow-y-auto">
        <RadioGroup
          value={selectedType}
          onValueChange={onTypeChange}
          className="grid grid-cols-2 gap-3 md:gap-4 mb-6"
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

        {/* Conditional Content */}
        {selectedType?.startsWith('bracketing') && (
          <div className="mb-4">
            <BracketingInfoCard selectedType={selectedType as 'bracketing-3' | 'bracketing-5'} />
          </div>
        )}

        {/* Pro Tip only on desktop */}
        <div className="hidden md:block mb-6">
          <ProTipCard />
        </div>

        {/* Mobile spacing for sticky button */}
        <div className="h-20 md:h-0" />
      </div>

    </div>
  );
};

export default PhotoTypeStep;
