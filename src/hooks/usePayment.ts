
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface CreatePaymentParams {
  orderId: string;
  amount: number;
  currency?: string;
}

export const usePayment = () => {
  const { toast } = useToast();

  const createPaymentMutation = useMutation({
    mutationFn: async ({ orderId, amount, currency = "eur" }: CreatePaymentParams) => {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { orderId, amount, currency }
      });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error('Payment error:', error);
      toast({
        title: "Zahlungsfehler",
        description: "Bei der Zahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const processPayment = async (params: CreatePaymentParams) => {
    try {
      const result = await createPaymentMutation.mutateAsync(params);
      
      if (result.url) {
        // Open Stripe checkout in a new tab
        window.open(result.url, '_blank');
      }
      
      return result;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  };

  return {
    processPayment,
    isProcessingPayment: createPaymentMutation.isPending,
  };
};
