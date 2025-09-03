
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - compact for desktop */}
      {!isMobile && (
        <div className="text-center space-y-1 px-2 py-2 flex-shrink-0">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Wählen Sie Ihren Foto-Typ</h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Bestimmen Sie die Art Ihrer Fotos für optimale Verarbeitung.
          </p>
        </div>
      )}

      {/* Content Area - scrollable content */}
      <div className="px-3 py-1 flex-1 overflow-hidden">
        <RadioGroup
          value={selectedType}
          onValueChange={setPhotoType}
          className="h-full"
        >
          <div className="flex flex-col gap-1 sm:gap-2 h-[65%] md:grid md:grid-cols-2 md:gap-4 md:h-auto">
            {photoTypes.map((type) => (
              <PhotoTypeCard
                key={type.id}
                id={type.id}
                title={type.title}
                description={type.description}
                icon={type.icon}
                isCustomImage={type.isCustomImage}
                isSelected={selectedType === type.id}
                setPhotoType={setPhotoType}
              />
            ))}
          </div>
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

      {/* Fixed Button Area - always visible at bottom */}
      <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border/20 p-4 flex-shrink-0 shadow-lg">
        <div className="flex justify-end">
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
    </div>
  );
};

export default PhotoTypeStep;
