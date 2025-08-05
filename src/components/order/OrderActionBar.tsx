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
    <div className="fixed bottom-16 left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200/80 shadow-2xl z-20">
      {/* Enhanced Progress Section */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Schritt {currentIndex + 1} von {stepOrder.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% abgeschlossen
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-700 ease-out shadow-sm relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Action Buttons */}
      <div className="flex items-center justify-between px-6 pb-6 gap-4">
        {showBackButton ? (
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isProcessing}
            className="flex-1 max-w-[120px] h-12 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
          >
            Zurück
          </Button>
        ) : (
          <div className="flex-1 max-w-[120px]" />
        )}
        
        <Button
          onClick={onNext}
          disabled={!canProceed || isProcessing}
          className="flex-1 min-w-[180px] h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:shadow-sm relative overflow-hidden"
        >
          <span className="relative z-10">
            {isProcessing ? 'Verarbeitung...' : getNextButtonText()}
          </span>
          {!isProcessing && canProceed && (
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderActionBar;