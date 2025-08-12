
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
  
  // Use real store data with stable selectors
  const photoType = useOrderStore(state => state.photoType);
  const files = useOrderStore(state => state.files);
  const packageType = useOrderStore(state => state.package);
  const extras = useOrderStore(state => state.extras);
  const watermarkFile = useOrderStore(state => state.watermarkFile);
  const email = useOrderStore(state => state.email);
  const company = useOrderStore(state => state.company);
  const objectReference = useOrderStore(state => state.objectReference);
  const specialRequests = useOrderStore(state => state.specialRequests);
  const acceptedTerms = useOrderStore(state => state.acceptedTerms);
  const updateOrderData = useOrderStore(state => state.updateOrderData);

  // Stable order data object using real store values
  const orderData = useMemo(() => ({
    photoType,
    files,
    package: packageType,
    extras,
    watermarkFile,
    email,
    company,
    objectReference,
    specialRequests,
    acceptedTerms,
  }), [photoType, files, packageType, extras, watermarkFile, email, company, objectReference, specialRequests, acceptedTerms]);
  
  // Use store's updateOrderData function with stable reference
  const memoizedUpdateOrderData = useCallback((updates: Partial<typeof orderData>) => {
    console.log('Updating order data:', updates);
    // Access updateOrderData directly from the store to avoid dependency issues
    useOrderStore.getState().updateOrderData(updates);
  }, []); // Empty dependency array since we're accessing store directly

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
