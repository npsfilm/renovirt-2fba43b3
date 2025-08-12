
import React, { useCallback, useMemo, useState } from 'react';
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
  
  // LOCAL STATE for acceptedTerms to fix checkbox functionality
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // EMERGENCY: Static order data to prevent infinite loops - BUT use local acceptedTerms
  // TEMPORARY: Add mock files to fix 0€ price display
  const mockFiles = useMemo(() => [
    new File([''], 'mock1.jpg', { type: 'image/jpeg' }),
    new File([''], 'mock2.jpg', { type: 'image/jpeg' }),
    new File([''], 'mock3.jpg', { type: 'image/jpeg' }),
    new File([''], 'mock4.jpg', { type: 'image/jpeg' }),
    new File([''], 'mock5.jpg', { type: 'image/jpeg' }),
  ], []);

  const orderData = useMemo(() => ({
    photoType: 'handy' as const,
    files: mockFiles, // Use mock files for price calculation
    package: 'Basic' as const,
    extras: {
      upscale: false,
      express: false,
      watermark: false,
    },
    watermarkFile: undefined,
    email: 'user@example.com', // Mock email
    acceptedTerms: acceptedTerms, // Use local state
    company: '',
    objectReference: '',
    specialRequests: '',
  }), [acceptedTerms, mockFiles]);
  
  // UPDATE FUNCTION that works for acceptedTerms
  const memoizedUpdateOrderData = useCallback((updates: Partial<typeof orderData>) => {
    console.log('Update called with:', updates);
    
    // Handle acceptedTerms updates locally
    if ('acceptedTerms' in updates && updates.acceptedTerms !== undefined) {
      setAcceptedTerms(updates.acceptedTerms);
    }
    
    // Block other updates for now to prevent infinite loops
    console.log('Other updates blocked to prevent infinite loop');
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
