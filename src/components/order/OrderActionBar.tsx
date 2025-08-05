import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, Lock, CreditCard } from 'lucide-react';

interface OrderActionBarProps {
  currentStep: 'photo-type' | 'upload' | 'package' | 'extras' | 'summary' | 'confirmation';
  canProceed: boolean;
  isProcessing?: boolean;
  finalPrice?: number;
  paymentMethod?: 'stripe' | 'invoice';
  onNext: () => void;
  onPrev: () => void;
}

const OrderActionBar = ({ 
  currentStep, 
  canProceed, 
  isProcessing = false,
  finalPrice = 0,
  paymentMethod = 'stripe',
  onNext, 
  onPrev 
}: OrderActionBarProps) => {
  // Don't show action bar on confirmation step
  if (currentStep === 'confirmation') {
    return null;
  }

  const getNextButtonText = () => {
    switch (currentStep) {
      case 'photo-type':
        return 'Weiter zum Upload';
      case 'upload':
        return 'Weiter zum Paket';
      case 'package':
        return 'Weiter zu Extras';
      case 'extras':
        return 'Weiter zur Zusammenfassung';
      case 'summary':
        if (isProcessing) {
          return paymentMethod === 'stripe' ? 'Weiterleitung zur Zahlung...' : 'Bestellung wird verarbeitet...';
        }
        if (finalPrice > 0) {
          return paymentMethod === 'stripe' 
            ? `Jetzt bezahlen • ${finalPrice.toFixed(2)} €`
            : `Kostenpflichtig bestellen • ${finalPrice.toFixed(2)} €`;
        }
        return 'Kostenlos bestellen';
      default:
        return 'Weiter';
    }
  };

  const getNextButtonIcon = () => {
    if (currentStep === 'summary') {
      if (isProcessing) {
        return <Loader2 className="w-4 h-4 animate-spin" />;
      }
      if (finalPrice > 0 && paymentMethod === 'stripe') {
        return <CreditCard className="w-4 h-4" />;
      }
      return <Lock className="w-4 h-4" />;
    }
    return <ArrowRight className="w-4 h-4" />;
  };

  const showBackButton = currentStep !== 'photo-type';

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border shadow-lg z-40">
      <div className="p-4">
        <div className="flex gap-3">
          {showBackButton && (
            <Button 
              variant="outline" 
              onClick={onPrev} 
              disabled={isProcessing}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          )}
          
          <Button
            onClick={onNext}
            disabled={!canProceed || isProcessing}
            size="lg"
            className={`flex-1 min-h-[48px] text-base font-medium transition-all duration-200 ${
              canProceed && !isProcessing
                ? 'bg-primary hover:bg-primary/90 hover:shadow-lg transform hover:scale-[1.02]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {getNextButtonIcon()}
            <span className="ml-2">{getNextButtonText()}</span>
          </Button>
        </div>
        
        {/* Security Notice for Summary Step */}
        {currentStep === 'summary' && (
          <div className="text-center mt-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>Sichere Bestellung • SSL-verschlüsselt</span>
            </div>
            {paymentMethod === 'stripe' && finalPrice > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Sie werden zur sicheren Stripe-Zahlungsseite weitergeleitet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderActionBar;