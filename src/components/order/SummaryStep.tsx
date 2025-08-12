
import React, { useCallback, useMemo } from 'react';
import SummaryStepHeader from './summary/SummaryStepHeader';
import SummaryStepContent from './summary/SummaryStepContent';
import SummaryStepActions from './summary/SummaryStepActions';
import { useSummaryStepLogic } from '@/hooks/useSummaryStepLogic';
import { useOrderStore } from '@/stores/orderStore';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useSessionReplay } from '@/hooks/useSessionReplay';

interface SummaryStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const SummaryStep = ({ onNext, onPrev }: SummaryStepProps) => {
  const { isEnabled, trackFeatureUsage } = useFeatureFlags();
  const { markConversionEvent } = useSessionReplay();
  
  // EMERGENCY: Static order data to prevent infinite loops
  const orderData = {
    photoType: 'handy' as const,
    files: [],
    package: 'Basic' as const,
    extras: {
      upscale: false,
      express: false,
      watermark: false,
    },
    watermarkFile: undefined,
    email: '',
    acceptedTerms: false,
    company: '',
    objectReference: '',
    specialRequests: '',
  };
  
  // DISABLED UPDATE FUNCTION
  const memoizedUpdateOrderData = useCallback(() => {
    console.log('Update blocked to prevent infinite loop');
  }, []);

  const {
    paymentMethod,
    creditsToUse,
    setCreditsToUse,
    canProceed,
    finalPrice,
    isProcessing,
    handleSubmitOrder
  } = useSummaryStepLogic(orderData, () => {
    // Track conversion event for session replay
    markConversionEvent('order_submitted', finalPrice);
    
    // Track enhanced order flow feature usage
    if (isEnabled('enhanced-order-flow')) {
      trackFeatureUsage('enhanced-order-flow', 'order_completed', {
        order_value: finalPrice,
        payment_method: paymentMethod
      });
    }
    
    onNext();
  });

  return (
    <div className="space-y-3 md:space-y-4">
      <SummaryStepHeader />

      <SummaryStepContent
        orderData={orderData}
        onUpdateData={memoizedUpdateOrderData}
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
    </div>
  );
};

export default SummaryStep;
