
import { useState, useEffect } from 'react';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryValidation = (orderData: OrderData) => {
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    // Check if the order can proceed based on the acceptance of terms
    setCanProceed(orderData.acceptedTerms);
  }, [orderData.acceptedTerms]);

  return {
    canProceed
  };
};
