
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'space-y-6' : 'flex flex-col h-full min-h-0'}`}>
      {/* Header - optimized for mobile */}
      {!isMobile && (
        <div className="text-center space-y-2 px-2 md:px-4 py-4 md:py-8 flex-shrink-0">
          <h1 className="text-xl md:text-3xl font-semibold text-foreground tracking-tight">Wählen Sie Ihren Foto-Typ</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung.
          </p>
        </div>
      )}

      {/* Content Area */}
      <div className={`${isMobile ? 'px-4 py-6 space-y-4' : 'flex-1 min-h-0 px-2 md:px-4 overflow-y-auto'}`}>
        <RadioGroup
          value={selectedType}
          onValueChange={onTypeChange}
          className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mb-8'}`}
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
          <div className={`${isMobile ? 'mt-6' : 'mb-4'}`}>
            <BracketingInfoCard selectedType={selectedType as 'bracketing-3' | 'bracketing-5'} />
          </div>
        )}

        {/* Pro Tip only on desktop */}
        <div className="hidden md:block mb-6">
          <ProTipCard />
        </div>

        {/* Mobile spacing for sticky button */}
        <div className={`${isMobile ? 'h-0' : 'h-20 md:h-0'}`} />
      </div>

      {/* Desktop Button Area - hidden on mobile */}
      <div className="hidden md:block sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-4 pb-6 px-2 md:px-4 flex-shrink-0 md:relative md:bg-none md:pt-6">
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          size="lg"
          className="w-full md:w-auto md:min-w-[180px] md:ml-auto md:flex shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
        >
          Weiter zum Upload →
        </Button>
      </div>
    </div>
  );
};

export default PhotoTypeStep;
