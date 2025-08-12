
import { useState, useMemo, useCallback } from 'react';
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

  const { handleSubmitOrder } = useSummaryOrderCreation();

  // Memoize expensive calculations to prevent infinite loops
  const totalPrice = useMemo(() => {
    if (!packages || !addOns) return 0;
    return calculateOrderTotal(orderData, packages, addOns);
  }, [orderData, packages, addOns]);
  
  const finalPrice = useMemo(() => Math.max(0, totalPrice - creditsToUse), [totalPrice, creditsToUse]);
  
  const canProceed = useMemo(() => !!(
    orderData.photoType &&
    orderData.package &&
    orderData.acceptedTerms &&
    orderData.email &&
    orderData.email.includes('@')
  ), [orderData.photoType, orderData.package, orderData.acceptedTerms, orderData.email]);

  const handleSubmit = useCallback((onOrderSuccess?: (orderId: string) => void) => {
    // Enhanced order handling with order ID callback
    handleSubmitOrder(
      orderData,
      paymentMethod,
      creditsToUse,
      finalPrice,
      canProceed,
      setIsProcessing,
      null, // No Stripe payment function needed
      (orderId?: string) => {
        if (orderId && onOrderSuccess) {
          onOrderSuccess(orderId);
        } else {
          onNext();
        }
      }
    );
  }, [handleSubmitOrder, orderData, paymentMethod, creditsToUse, finalPrice, canProceed, onNext]);

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
