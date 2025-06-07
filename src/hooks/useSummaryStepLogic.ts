
import { useSummaryPricing } from './summary/useSummaryPricing';
import { useSummaryPayment } from './summary/useSummaryPayment';
import { useSummaryValidation } from './summary/useSummaryValidation';
import { useSummaryOrderCreation } from './summary/useSummaryOrderCreation';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryStepLogic = (orderData: OrderData, onNext: () => void) => {
  const { creditsToUse, setCreditsToUse, finalPrice } = useSummaryPricing(orderData);
  const { canProceed } = useSummaryValidation(orderData);
  const {
    paymentMethod,
    setPaymentMethod,
    showPaymentModal,
    setShowPaymentModal,
    isProcessing,
    setIsProcessing,
    clientSecret,
    handlePaymentModalSuccess: baseHandlePaymentModalSuccess,
    handlePaymentModalError,
    initiateStripePayment
  } = useSummaryPayment();
  const { handleSubmitOrder: baseHandleSubmitOrder, createOrderAfterPayment } = useSummaryOrderCreation();

  // Wrapper function that includes createOrderAfterPayment and onNext
  const handlePaymentModalSuccess = async (paymentIntentId: string) => {
    await baseHandlePaymentModalSuccess(paymentIntentId, createOrderAfterPayment, onNext);
  };

  // Wrapper function that includes all necessary parameters
  const handleSubmitOrder = async () => {
    await baseHandleSubmitOrder(
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
    handleSubmitOrder,
    handlePaymentModalSuccess,
    handlePaymentModalError
  };
};
