
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async (amount: number, orderId: string = 'temp-order-id') => {
    setIsLoading(true);
    
    console.log('=== PAYMENT INITIATION START ===');
    console.log('Payment details:', { amount, orderId });
    console.log('Current origin:', window.location.origin);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount, orderId }
      });

      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (data) {
        console.log('Payment data received:', data);
        if (data.debug) {
          console.log('Debug info:', data.debug);
        }
      }
      
      console.log('=== PAYMENT INITIATION SUCCESS ===');
      return data;
    } catch (error: any) {
      console.error('=== PAYMENT INITIATION ERROR ===');
      console.error('Payment initiation error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      toast({
        title: 'Zahlungsfehler',
        description: error.message || 'Die Zahlung konnte nicht initialisiert werden.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (paymentIntentId: string) => {
    console.log('=== PAYMENT VERIFICATION START ===');
    console.log('Verifying payment:', paymentIntentId);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { paymentIntentId }
      });

      console.log('Verification response:', { data, error });

      if (error) {
        console.error('Verification error:', error);
        throw error;
      }
      
      console.log('=== PAYMENT VERIFICATION SUCCESS ===');
      return data;
    } catch (error: any) {
      console.error('=== PAYMENT VERIFICATION ERROR ===');
      console.error('Payment verification error details:', {
        message: error.message,
        details: error.details,
        paymentIntentId
      });
      throw error;
    }
  };

  const confirmPayment = async (paymentIntentId: string) => {
    try {
      return await verifyPayment(paymentIntentId);
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      throw error;
    }
  };

  return {
    initiatePayment,
    confirmPayment,
    verifyPayment,
    isLoading
  };
};
