
import React from 'react';
import OrderSummaryDetails from './OrderSummaryDetails';
import PaymentMethodSelector from './PaymentMethodSelector';
import TermsAcceptance from './TermsAcceptance';
import PriceSummary from './PriceSummary';
import type { OrderData } from '@/utils/orderValidation';

interface SummaryStepContentProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
  paymentMethod: 'stripe' | 'invoice';
  onPaymentMethodChange: (method: 'stripe' | 'invoice') => void;
  creditsToUse: number;
  onCreditsChange: (credits: number) => void;
}

const SummaryStepContent = ({
  orderData,
  onUpdateData,
  paymentMethod,
  onPaymentMethodChange,
  creditsToUse,
  onCreditsChange
}: SummaryStepContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <OrderSummaryDetails orderData={orderData} onUpdateData={onUpdateData} />
        <PaymentMethodSelector paymentMethod={paymentMethod} onPaymentMethodChange={onPaymentMethodChange} />
        <TermsAcceptance 
          acceptedTerms={orderData.acceptedTerms} 
          onTermsChange={(accepted) => onUpdateData({ acceptedTerms: accepted })} 
        />
      </div>

      <div>
        <PriceSummary 
          orderData={orderData} 
          creditsToUse={creditsToUse}
          onCreditsChange={onCreditsChange}
        />
      </div>
    </div>
  );
};

export default SummaryStepContent;
