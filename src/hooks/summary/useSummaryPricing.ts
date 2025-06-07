
import { useState, useEffect } from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useOrders } from '@/hooks/useOrders';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryPricing = (orderData: OrderData) => {
  const [creditsToUse, setCreditsToUse] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const { calculateTotalPrice } = useOrders();
  const userCreditsResult = useUserCredits();
  const { credits, isLoading: creditsLoading } = userCreditsResult;

  useEffect(() => {
    // Guard condition: only calculate pricing if orderData has required fields and credits are loaded
    if (!orderData || !orderData.extras || !orderData.files || creditsLoading) {
      return;
    }

    // Use the same calculation as in PriceSummary
    const grossPrice = calculateTotalPrice(orderData);
    const creditsDiscount = Math.min(credits || 0, grossPrice);
    const calculatedFinalPrice = Math.max(0, grossPrice - creditsDiscount);
    
    setFinalPrice(calculatedFinalPrice);

    // Automatically use all available credits if possible
    if (credits && grossPrice > 0) {
      setCreditsToUse(Math.min(credits, creditsDiscount));
    } else {
      setCreditsToUse(0);
    }
  }, [orderData, credits, creditsLoading, calculateTotalPrice]);

  return {
    creditsToUse,
    setCreditsToUse,
    finalPrice,
    creditsLoading
  };
};
