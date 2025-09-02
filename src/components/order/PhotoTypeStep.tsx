
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { useIsMobile } from '@/hooks/use-mobile';
import PhotoTypeCard from './photo-type/PhotoTypeCard';
import BracketingInfoCard from './photo-type/BracketingInfoCard';
import ProTipCard from './photo-type/ProTipCard';
import { photoTypes } from './photo-type/photoTypeData';
import { useOrderStore } from '@/stores/orderStore';

interface PhotoTypeStepProps {
  onNext: () => void;
}

const PhotoTypeStep = ({ onNext }: PhotoTypeStepProps) => {
  const selectedType = useOrderStore((state) => state.photoType);
  const setPhotoType = useOrderStore((state) => state.setPhotoType);
  const canProceed = selectedType !== undefined;
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'h-screen flex flex-col overflow-hidden' : 'flex flex-col h-full min-h-0'}`}>
      {/* Header - compact for desktop */}
      {!isMobile && (
        <div className="text-center space-y-1 px-2 py-2 flex-shrink-0">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Wählen Sie Ihren Foto-Typ</h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung.
          </p>
        </div>
      )}

      {/* Content Area - MINIMAL SPACING */}
      <div className="px-3 py-1 pb-20 flex-1 overflow-hidden">
        <RadioGroup
          value={selectedType}
          onValueChange={setPhotoType}
          className="grid grid-cols-1 gap-1 h-full"
        >
          {photoTypes.map((type) => (
            <PhotoTypeCard
              key={type.id}
              id={type.id}
              title={type.title}
              description={type.description}
              icon={type.icon}
              isSelected={selectedType === type.id}
              setPhotoType={setPhotoType}
            />
          ))}
        </RadioGroup>

        {/* Conditional Content */}
        {selectedType?.startsWith('bracketing') && (
          <div className={`${isMobile ? 'mt-6' : 'mb-3'}`}>
            <BracketingInfoCard selectedType={selectedType as 'bracketing-3' | 'bracketing-5'} />
          </div>
        )}

        {/* Pro Tip only on desktop - compact */}
        <div className="hidden md:block mb-3">
          <ProTipCard />
        </div>
      </div>


      {/* Desktop Button Area - hidden on mobile */}
      <div className="hidden md:block sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-3 pb-4 px-2 flex-shrink-0 md:relative md:bg-none md:pt-4">
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
