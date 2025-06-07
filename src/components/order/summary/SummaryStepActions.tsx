
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  return (
    <div className="flex justify-between items-center pt-6 border-t border-border">
      <Button variant="outline" onClick={onPrev} disabled={isProcessing} className="shadow-sm">
        ← Zurück zum Paket
      </Button>
      
      <Button
        onClick={onSubmit}
        disabled={!canProceed || isProcessing}
        size="lg"
        className="min-w-[200px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verarbeitung...
          </>
        ) : finalPrice > 0 ? (
          paymentMethod === 'stripe' ? 'Zur Zahlung' : 'Bestellung abschicken'
        ) : (
          'Kostenlose Bestellung abschicken'
        )}
      </Button>
    </div>
  );
};

export default SummaryStepActions;
