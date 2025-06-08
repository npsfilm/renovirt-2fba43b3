
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async (amount: number, orderId: string = 'temp-order-id') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount, orderId }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Payment initiation error:', error);
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
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { paymentIntentId }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Payment verification error:', error);
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
