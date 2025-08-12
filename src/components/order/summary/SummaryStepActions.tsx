
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Lock, CreditCard } from 'lucide-react';

interface SummaryStepActionsProps {
  onPrev: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isProcessing: boolean;
  finalPrice: number;
  paymentMethod: 'invoice';
}

const SummaryStepActions = ({ 
  onPrev, 
  onSubmit, 
  canProceed, 
  isProcessing, 
  finalPrice, 
  paymentMethod 
}: SummaryStepActionsProps) => {
  const getButtonText = () => {
    if (isProcessing) {
      return 'Bestellung wird verarbeitet...';
    }
    
    if (finalPrice > 0) {
      return `Kostenpflichtig bestellen • ${finalPrice.toFixed(2)} €`;
    } else {
      return 'Kostenlos bestellen';
    }
  };

  const getButtonIcon = () => {
    if (isProcessing) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    
    return <Lock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-gray-200 px-3 md:px-0">
      {/* Desktop Action Buttons - hidden on mobile */}
      <div className="hidden md:flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          onClick={onPrev} 
          disabled={isProcessing}
          className="order-2 sm:order-1 sm:w-auto flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        
        <Button
          onClick={onSubmit}
          disabled={!canProceed || isProcessing}
          size="lg"
          className={`order-1 sm:order-2 flex-1 min-h-[48px] text-base font-medium transition-all duration-200 ${
            canProceed && !isProcessing
              ? 'bg-primary hover:bg-primary/90 hover:shadow-lg transform hover:scale-[1.02]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {getButtonIcon()}
          <span className="ml-2">{getButtonText()}</span>
        </Button>
      </div>
      
      {/* Mobile Action Buttons */}
      <div className="md:hidden flex flex-col gap-3">
        <Button
          onClick={onSubmit}
          disabled={!canProceed || isProcessing}
          className={`w-full min-h-[48px] text-base font-medium transition-all duration-200 ${
            canProceed && !isProcessing
              ? 'bg-primary hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {getButtonIcon()}
          <span className="ml-2">{getButtonText()}</span>
        </Button>
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isProcessing}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
      </div>
      
      {/* Security Notice */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
          <Lock className="w-3 h-3 md:w-4 md:h-4" />
          <span>Sichere Bestellung • SSL-verschlüsselt</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryStepActions;
