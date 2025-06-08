
import { useState } from 'react';

export interface VerificationAttempt {
  id: string;
  timestamp: number;
  method: 'supabase' | 'resend_custom';
  success: boolean;
  retryCount: number;
}

export const useVerificationAttempts = () => {
  const [attempts, setAttempts] = useState<VerificationAttempt[]>([]);

  const addAttempt = (attempt: VerificationAttempt) => {
    setAttempts(prev => [...prev, attempt]);
  };

  const getLastAttempt = () => {
    return attempts[attempts.length - 1];
  };

  const getTotalAttempts = () => {
    return attempts.length;
  };

  return {
    attempts,
    addAttempt,
    getLastAttempt,
    getTotalAttempts
  };
};
