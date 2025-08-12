
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  // Stable order data object using real store values with email validation
  const orderData = useMemo(() => {
    // Validate email before creating order data
    const trimmedEmail = email?.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      console.warn('Invalid email format detected:', trimmedEmail);
    }
    
    return {
      photoType,
      files,
      package: packageType,
      extras,
      watermarkFile,
      email: trimmedEmail || '',
      company,
      objectReference,
      specialRequests,
      acceptedTerms,
    };
  }, [photoType, files, packageType, extras, watermarkFile, email, company, objectReference, specialRequests, acceptedTerms]);
  
  // Use orderData directly - the useMemo above already provides stability
  // No need for additional JSON.stringify memoization which causes performance issues
  
  // Use store's updateOrderData function with stable reference
  const memoizedUpdateOrderData = useCallback((updates: Partial<typeof orderData>) => {
    console.log('memoizedUpdateOrderData called with:', updates);
    updateOrderData(updates);
  }, [updateOrderData]);

  const {
    paymentMethod,
    creditsToUse,
    setCreditsToUse,
    canProceed,
    finalPrice,
    isProcessing,
    handleSubmitOrder
  } = useSummaryStepLogic(orderData, () => {
    // Default navigation fallback
    onNext();
  });

  // Enhanced submit handler with order ID navigation
  const handleEnhancedSubmit = useCallback(() => {
    handleSubmitOrder((orderId: string) => {
      // Track conversion event for session replay
      markConversionEvent('order_submitted', finalPrice);
      
      // Track feature flag usage
      if (isEnabled('enhanced-order-flow')) {
        trackFeatureUsage('enhanced-order-flow', 'order_completed', {
          order_value: finalPrice,
          payment_method: paymentMethod,
          orderId
        });
      }
      
      // Navigate to confirmation page with order ID
      navigate(`/order-confirmation/${orderId}`);
    });
  }, [handleSubmitOrder, finalPrice, paymentMethod, markConversionEvent, trackFeatureUsage, navigate, isEnabled]);

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
        onSubmit={handleEnhancedSubmit}
        canProceed={canProceed}
        isProcessing={isProcessing}
        finalPrice={finalPrice}
        paymentMethod={paymentMethod}
      />
    </div>
  );
};

export default SummaryStep;
