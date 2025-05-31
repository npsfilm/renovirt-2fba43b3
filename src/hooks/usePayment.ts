
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface CreatePaymentParams {
  orderId: string;
  amount: number;
  currency?: string;
}

interface VerifyPaymentParams {
  sessionId: string;
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
    onError: (error: any) => {
      console.error('Payment error:', error);
      
      if (error.message?.includes('Stripe is not configured')) {
        toast({
          title: "Zahlungsanbieter nicht verfügbar",
          description: "Die Stripe-Integration ist nicht konfiguriert. Bitte kontaktieren Sie den Support.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Zahlungsfehler",
          description: "Bei der Zahlung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async ({ sessionId }: VerifyPaymentParams) => {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.paymentStatus === 'paid') {
        toast({
          title: "Zahlung erfolgreich!",
          description: "Ihre Zahlung wurde verarbeitet. Die Bearbeitung beginnt nun.",
        });
      }
    },
    onError: (error: any) => {
      console.error('Payment verification error:', error);
      toast({
        title: "Zahlungsverifizierung fehlgeschlagen",
        description: "Die Zahlung konnte nicht verifiziert werden. Bitte kontaktieren Sie den Support.",
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

  const verifyPayment = async (params: VerifyPaymentParams) => {
    return await verifyPaymentMutation.mutateAsync(params);
  };

  return {
    processPayment,
    verifyPayment,
    isProcessingPayment: createPaymentMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending,
  };
};
