
import React from 'react';
import SummaryStepHeader from './summary/SummaryStepHeader';
import SummaryStepContent from './summary/SummaryStepContent';
import SummaryStepActions from './summary/SummaryStepActions';

import { useSummaryStepLogic } from '@/hooks/useSummaryStepLogic';
import type { OrderData } from '@/utils/orderValidation';

interface SummaryStepProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SummaryStep = ({ orderData, onUpdateData, onNext, onPrev }: SummaryStepProps) => {
  const {
    paymentMethod,
    creditsToUse,
    setCreditsToUse,
    canProceed,
    finalPrice,
    isProcessing,
    handleSubmitOrder
  } = useSummaryStepLogic(orderData, onNext);

  return (
    <div className="space-y-3 md:space-y-4">
      <SummaryStepHeader />

      <SummaryStepContent
        orderData={orderData}
        onUpdateData={onUpdateData}
        paymentMethod={paymentMethod}
        creditsToUse={creditsToUse}
        onCreditsChange={setCreditsToUse}
      />

      <SummaryStepActions
        onPrev={onPrev}
        onSubmit={handleSubmitOrder}
        canProceed={canProceed}
        isProcessing={isProcessing}
        finalPrice={finalPrice}
        paymentMethod={paymentMethod}
      />

      {/* No payment modal needed for invoice-only payments */}
    </div>
  );
};

export default SummaryStep;
