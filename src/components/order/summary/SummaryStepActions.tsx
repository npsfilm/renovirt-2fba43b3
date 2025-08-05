
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Lock, CreditCard } from 'lucide-react';

interface SummaryStepActionsProps {
  onPrev: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isProcessing: boolean;
  finalPrice: number;
  paymentMethod: 'stripe' | 'invoice';
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
      return paymentMethod === 'stripe' ? 'Weiterleitung zur Zahlung...' : 'Bestellung wird verarbeitet...';
    }
    
    if (finalPrice > 0) {
      return paymentMethod === 'stripe' 
        ? `Jetzt bezahlen • ${finalPrice.toFixed(2)} €`
        : `Kostenpflichtig bestellen • ${finalPrice.toFixed(2)} €`;
    } else {
      return 'Kostenlos bestellen';
    }
  };

  const getButtonIcon = () => {
    if (isProcessing) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    
    if (finalPrice > 0 && paymentMethod === 'stripe') {
      return <CreditCard className="w-4 h-4" />;
    }
    
    return <Lock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200">
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
      
      {/* Security Notice */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Sichere Bestellung • SSL-verschlüsselt</span>
        </div>
        {paymentMethod === 'stripe' && finalPrice > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Sie werden zur sicheren Stripe-Zahlungsseite weitergeleitet
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryStepActions;
