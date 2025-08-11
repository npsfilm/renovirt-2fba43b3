
import React, { useCallback } from 'react';
import OrderSummaryDetails from './OrderSummaryDetails';
import PaymentMethodSelector from './PaymentMethodSelector';
import TermsAcceptance from './TermsAcceptance';
import PriceSummary from './PriceSummary';
import type { OrderData } from '@/utils/orderValidation';

interface SummaryStepContentProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
  paymentMethod: 'invoice';
  creditsToUse: number;
  onCreditsChange: (credits: number) => void;
}

const SummaryStepContent = React.memo(({
  orderData,
  onUpdateData,
  paymentMethod,
  creditsToUse,
  onCreditsChange
}: SummaryStepContentProps) => {
  console.log('SummaryStepContent render:', { acceptedTerms: orderData.acceptedTerms });
  
  const handleTermsChange = useCallback((accepted: boolean) => {
    console.log('handleTermsChange called:', { accepted, current: orderData.acceptedTerms });
    onUpdateData({ acceptedTerms: accepted });
  }, [onUpdateData, orderData.acceptedTerms]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 px-3 md:px-0">
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        <OrderSummaryDetails orderData={orderData} onUpdateData={onUpdateData} />
        <PaymentMethodSelector paymentMethod={paymentMethod} onPaymentMethodChange={() => {}} />
        <TermsAcceptance 
          acceptedTerms={orderData.acceptedTerms} 
          onTermsChange={handleTermsChange} 
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
});

SummaryStepContent.displayName = 'SummaryStepContent';

export default SummaryStepContent;
