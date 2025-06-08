
import { useState, useEffect } from 'react';

export const useRetryLogic = () => {
  const [retryDelay, setRetryDelay] = useState(10);

  // Smart retry logic with exponential backoff
  const calculateRetryDelay = (attemptCount: number): number => {
    return Math.min(10 * Math.pow(1.5, attemptCount), 120); // Max 2 minutes
  };

  const updateRetryDelay = (attemptCount: number) => {
    const nextDelay = calculateRetryDelay(attemptCount + 1);
    setRetryDelay(nextDelay);
  };

  return {
    retryDelay,
    updateRetryDelay,
    calculateRetryDelay
  };
};
