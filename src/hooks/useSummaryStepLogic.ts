
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
    // Enhanced order handling with localStorage persistence for redirect payments
    if (paymentMethod === 'stripe' && finalPrice > 0) {
      // Store order context before initiating Stripe payment
      try {
        const orderDataForStorage = {
          ...orderData,
          creditsUsed: creditsToUse,
          finalPrice,
          paymentMethod: 'stripe',
          userId: user?.id,
          totalAmount: finalPrice
        };
        localStorage.setItem('pendingOrderData', JSON.stringify(orderDataForStorage));
        console.log('Order data stored in localStorage for redirect payment');
      } catch (error) {
        console.error('Failed to save pending order data to localStorage:', error);
        // Notify the user of the error and stop the process
        return;
      }
    }

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
    handlePaymentModalSuccess(paymentIntentId, createOrderAfterPayment, onNext, orderData);
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
