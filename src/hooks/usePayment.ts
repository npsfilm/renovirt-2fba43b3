
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = async (amount: number, orderId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { amount: Math.round(amount * 100), orderId }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
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

  const confirmPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('confirm-payment', {
        body: { sessionId }
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      throw error;
    }
  };

  return {
    initiatePayment,
    confirmPayment,
    isLoading
  };
};
