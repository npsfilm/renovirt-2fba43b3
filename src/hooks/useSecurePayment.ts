
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { validatePaymentRequest } from '@/utils/securityEnhancement';
import { logSecurityEvent } from '@/utils/secureLogging';
import { useToast } from '@/hooks/use-toast';

export const useSecurePayment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createSecurePayment = async (amount: number, orderId?: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);

    try {
      // Validate payment request
      const validation = validatePaymentRequest({
        amount,
        currency: 'EUR',
        userId: user.id
      });
      
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      logSecurityEvent('secure_payment_initiated', { 
        userId: user.id, 
        amount, 
        orderId 
      });

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount, orderId, currency: 'eur' }
      });

      if (error) {
        logSecurityEvent('secure_payment_failed', { 
          userId: user.id, 
          error: error.message,
          amount 
        });
        throw error;
      }

      logSecurityEvent('secure_payment_created', { 
        userId: user.id, 
        paymentIntentId: data.payment_intent_id 
      });

      return data;
    } catch (error: any) {
      logSecurityEvent('secure_payment_error', { 
        userId: user.id, 
        error: error.message 
      });
      
      toast({
        title: "Zahlungsfehler",
        description: error.message || "Ein Fehler ist bei der Zahlungsverarbeitung aufgetreten.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentIntentId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      logSecurityEvent('payment_verification_initiated', { 
        userId: user.id, 
        paymentIntentId 
      });

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { paymentIntentId }
      });

      if (error) {
        logSecurityEvent('payment_verification_failed', { 
          userId: user.id, 
          paymentIntentId,
          error: error.message 
        });
        throw error;
      }

      logSecurityEvent('payment_verification_success', { 
        userId: user.id, 
        paymentIntentId 
      });

      return data;
    } catch (error: any) {
      logSecurityEvent('payment_verification_error', { 
        userId: user.id, 
        error: error.message 
      });
      throw error;
    }
  };

  return {
    createSecurePayment,
    verifyPayment,
    loading
  };
};
