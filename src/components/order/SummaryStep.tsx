
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import OrderSummaryDetails from './summary/OrderSummaryDetails';
import PaymentMethodSelector from './summary/PaymentMethodSelector';
import TermsAcceptance from './summary/TermsAcceptance';
import PriceSummary from './summary/PriceSummary';

interface OrderData {
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  couponCode?: string;
  acceptedTerms: boolean;
}

interface SummaryStepProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SummaryStep = ({ orderData, onUpdateData, onNext, onPrev }: SummaryStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');

  const canProceed = orderData.acceptedTerms && orderData.email;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Letzter Check: Ihre Bestellung</h1>
        <p className="text-gray-600">Bitte überprüfen Sie Ihre Auswahl. Mit Klick auf "Kostenpflichtig bestellen" wird die Bestellung verbindlich.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderSummaryDetails orderData={orderData} onUpdateData={onUpdateData} />
          <PaymentMethodSelector paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          <TermsAcceptance 
            acceptedTerms={orderData.acceptedTerms} 
            onTermsChange={(accepted) => onUpdateData({ acceptedTerms: accepted })} 
          />
        </div>

        <div>
          <PriceSummary orderData={orderData} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          ← Zurück zum Paket
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[200px] bg-green-600 hover:bg-green-700"
        >
          Kostenpflichtig bestellen →
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
