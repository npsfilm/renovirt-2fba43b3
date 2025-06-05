
import React from 'react';
import { Button } from '@/components/ui/button';

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
    if (isProcessing) return "Wird erstellt...";
    if (finalPrice > 0) {
      return paymentMethod === 'stripe' ? "Zur Zahlung →" : "Kostenpflichtig bestellen →";
    }
    return "Kostenlos bestellen →";
  };

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onPrev}>
        ← Zurück zum Paket
      </Button>
      <Button 
        onClick={onSubmit}
        disabled={!canProceed || isProcessing}
        className="min-w-[200px] bg-green-600 hover:bg-green-700"
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default SummaryStepActions;
