import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

type Step = 'photo-type' | 'upload' | 'package' | 'extras' | 'summary' | 'confirmation';

interface OrderActionBarProps {
  currentStep: Step;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  isProcessing?: boolean;
}

const OrderActionBar = ({
  currentStep,
  canProceed,
  onNext,
  onPrev,
  isProcessing = false
}: OrderActionBarProps) => {
  const isMobile = useIsMobile();

  // Only render on mobile and not on confirmation step
  if (!isMobile || currentStep === 'confirmation') {
    return null;
  }

  // Calculate progress percentage
  const stepOrder = ['photo-type', 'upload', 'package', 'extras', 'summary'];
  const currentIndex = stepOrder.indexOf(currentStep);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / stepOrder.length) * 100 : 0;

  // Show back button for all steps except the first
  const showBackButton = currentStep !== 'photo-type';

  // Button text based on step
  const getNextButtonText = () => {
    switch (currentStep) {
      case 'photo-type':
        return 'Weiter zum Upload';
      case 'upload':
        return 'Weiter zu Paket';
      case 'package':
        return 'Weiter zu Extras';
      case 'extras':
        return 'Weiter zur Übersicht';
      case 'summary':
        return 'Jetzt bestellen';
      default:
        return 'Weiter';
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border/40 shadow-lg z-20">
      {/* Progress Bar */}
      <div className="px-4 pt-3">
        <Progress value={progress} className="h-1" />
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 gap-3">
        {showBackButton ? (
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isProcessing}
            className="flex-1 max-w-[120px]"
          >
            Zurück
          </Button>
        ) : (
          <div className="flex-1 max-w-[120px]" />
        )}
        
        <Button
          onClick={onNext}
          disabled={!canProceed || isProcessing}
          className="flex-1 min-w-[180px] shadow-sm"
        >
          {isProcessing ? 'Verarbeitung...' : getNextButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default OrderActionBar;