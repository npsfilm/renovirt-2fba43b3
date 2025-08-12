import React, { useState, useEffect } from 'react';
import SummaryStepHeader from './summary/SummaryStepHeader';
import SummaryStepContent from './summary/SummaryStepContent';
import SummaryStepActions from './summary/SummaryStepActions';
import { useSummaryStepLogic } from '@/hooks/useSummaryStepLogic';
import { useOrderStore } from '@/stores/orderStore';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useSessionReplay } from '@/hooks/useSessionReplay';
import type { OrderData } from '@/utils/orderValidation';

interface SummaryStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const SummaryStepIsolated = ({ onNext, onPrev }: SummaryStepProps) => {
  const { isEnabled, trackFeatureUsage } = useFeatureFlags();
  const { markConversionEvent } = useSessionReplay();
  
  // Get initial data once without subscriptions
  const initialOrderData = useOrderStore.getState();
  
  // Local state to prevent store loops
  const [localOrderData, setLocalOrderData] = useState<OrderData>({
    photoType: initialOrderData.photoType,
    files: initialOrderData.files,
    package: initialOrderData.package,
    extras: initialOrderData.extras,
    watermarkFile: initialOrderData.watermarkFile,
    email: initialOrderData.email,
    acceptedTerms: initialOrderData.acceptedTerms,
    company: initialOrderData.company,
    objectReference: initialOrderData.objectReference,
    specialRequests: initialOrderData.specialRequests,
  });

  // Update local state when store changes (one-way only)
  useEffect(() => {
    const unsubscribe = useOrderStore.subscribe((state) => {
      setLocalOrderData({
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
      });
    });
    
    return unsubscribe;
  }, []);

  // Direct store update function (bypassing reactive hooks)
  const updateOrderData = (updates: Partial<OrderData>) => {
    console.log('Direct store update:', updates);
    // Update store directly without causing re-renders in this component
    const store = useOrderStore.getState();
    store.updateOrderData(updates);
  };

  const {
    paymentMethod,
    creditsToUse,
    setCreditsToUse,
    canProceed,
    finalPrice,
    isProcessing,
    handleSubmitOrder
  } = useSummaryStepLogic(localOrderData, () => {
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
        orderData={localOrderData}
        onUpdateData={updateOrderData}
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

export default SummaryStepIsolated;