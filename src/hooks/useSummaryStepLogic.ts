
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrderData } from '@/hooks/useOrderData';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { useSummaryOrderCreation } from '@/hooks/summary/useSummaryOrderCreation';
import { secureLog } from '@/utils/secureLogging';
import { useToast } from '@/hooks/use-toast';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryStepLogic = (orderData: OrderData, onNext: () => void) => {
  const [creditsToUse, setCreditsToUse] = useState(0);
  const { user } = useAuth();
  const { packages, addOns } = useOrderData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [paymentMethod] = useState<'invoice'>('invoice');
  const [isProcessing, setIsProcessing] = useState(false);

  const { handleSubmitOrder, createOrderAfterPayment } = useSummaryOrderCreation();

  const totalPrice = calculateOrderTotal(orderData, packages, addOns);
  const finalPrice = Math.max(0, totalPrice - creditsToUse);
  
  const canProceed = !!(
    orderData.photoType &&
    orderData.package &&
    orderData.acceptedTerms
  );

  const handleSubmit = () => {
    // Simplified order handling for invoice-only payment
    handleSubmitOrder(
      orderData,
      paymentMethod,
      creditsToUse,
      finalPrice,
      canProceed,
      setIsProcessing,
      null, // No Stripe payment function needed
      onNext
    );
  };

  // No payment success handler needed for invoice payments

  return {
    paymentMethod,
    creditsToUse,
    setCreditsToUse,
    canProceed,
    finalPrice,
    isProcessing,
    handleSubmitOrder: handleSubmit
  };
};
