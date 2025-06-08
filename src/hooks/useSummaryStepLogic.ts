
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrderData } from '@/hooks/useOrderData';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { useSummaryOrderCreation } from '@/hooks/summary/useSummaryOrderCreation';
import { useSummaryPayment } from '@/hooks/summary/useSummaryPayment';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryStepLogic = (orderData: OrderData, onNext: () => void) => {
  const [creditsToUse, setCreditsToUse] = useState(0);
  const { user } = useAuth();
  const { packages, addOns } = useOrderData();
  
  const {
    paymentMethod,
    setPaymentMethod,
    showPaymentModal,
    setShowPaymentModal,
    isProcessing,
    setIsProcessing,
    clientSecret,
    handlePaymentModalSuccess,
    handlePaymentModalError,
    initiateStripePayment
  } = useSummaryPayment();

  const { handleSubmitOrder, createOrderAfterPayment } = useSummaryOrderCreation();

  const totalPrice = calculateOrderTotal(orderData, packages, addOns);
  const finalPrice = Math.max(0, totalPrice - creditsToUse);
  
  const canProceed = !!(
    orderData.photoType &&
    orderData.files.length > 0 &&
    orderData.package &&
    orderData.email &&
    orderData.acceptedTerms
  );

  const handleSubmit = () => {
    handleSubmitOrder(
      orderData,
      paymentMethod,
      creditsToUse,
      finalPrice,
      canProceed,
      setIsProcessing,
      initiateStripePayment,
      onNext
    );
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    handlePaymentModalSuccess(paymentIntentId, createOrderAfterPayment, onNext);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    creditsToUse,
    setCreditsToUse,
    showPaymentModal,
    setShowPaymentModal,
    canProceed,
    finalPrice,
    isProcessing,
    clientSecret,
    handleSubmitOrder: handleSubmit,
    handlePaymentModalSuccess: handlePaymentSuccess,
    handlePaymentModalError
  };
};
