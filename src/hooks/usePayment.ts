
import { useState } from 'react';
import { useSecurePayment } from './useSecurePayment';
import { logSecurityEvent } from '@/utils/secureLogging';
import { useAuth } from '@/hooks/useAuth';

export const usePayment = () => {
  const { user } = useAuth();
  const { createSecurePayment, verifyPayment, loading } = useSecurePayment();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const initiatePayment = async (amount: number, orderId?: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setPaymentStatus('processing');

    try {
      logSecurityEvent('payment_initiation_started', { 
        userId: user.id, 
        amount, 
        orderId 
      });

      const result = await createSecurePayment(amount, orderId);
      
      setPaymentStatus('success');
      
      logSecurityEvent('payment_initiation_success', { 
        userId: user.id, 
        paymentIntentId: result.payment_intent_id 
      });

      return result;
    } catch (error: any) {
      setPaymentStatus('error');
      
      logSecurityEvent('payment_initiation_failed', { 
        userId: user.id, 
        error: error.message 
      });
      
      throw error;
    }
  };

  const confirmPayment = async (paymentIntentId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await verifyPayment(paymentIntentId);
      
      logSecurityEvent('payment_confirmation_success', { 
        userId: user.id, 
        paymentIntentId 
      });

      return result;
    } catch (error: any) {
      logSecurityEvent('payment_confirmation_failed', { 
        userId: user.id, 
        paymentIntentId,
        error: error.message 
      });
      
      throw error;
    }
  };

  return {
    initiatePayment,
    confirmPayment,
    loading,
    paymentStatus
  };
};
