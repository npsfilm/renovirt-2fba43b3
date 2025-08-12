
import React, { useCallback } from 'react';
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
  
  const orderData = useOrderStore((state) => ({
    photoType: state.photoType,
    files: state.files,
    package: state.package,
    extras: state.extras,
    watermarkFile: state.watermarkFile,
    email: state.email,
    acceptedTerms: state.acceptedTerms,
    company: state.company,
    objectReference: state.objectReference,
    specialRequests: state.specialRequests,
  }));
  const updateOrderData = useOrderStore((state) => state.updateOrderData);
  
  // Stable reference for updateOrderData - use a ref to prevent recreation
  const updateRef = React.useRef(updateOrderData);
  updateRef.current = updateOrderData;
  
  const memoizedUpdateOrderData = useCallback((updates: Partial<typeof orderData>) => {
    console.log('memoizedUpdateOrderData called with:', updates);
    updateRef.current(updates);
  }, []); // No dependencies to ensure stable reference

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

      {/* No payment modal needed for invoice-only payments */}
    </div>
  );
};

export default SummaryStep;
