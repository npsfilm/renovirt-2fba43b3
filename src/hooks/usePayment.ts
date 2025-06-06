
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useReferralCredits } from '@/hooks/useReferralCredits';

interface PaymentData {
  orderId: string;
  amount: number;
  currency: string;
}

interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export const usePayment = () => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { approveReferralCredits } = useReferralCredits();

  const createPaymentIntent = async (paymentData: PaymentData): Promise<PaymentIntentResponse> => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setIsProcessingPayment(true);

    try {
      console.log('Creating payment intent for order:', paymentData.orderId);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          userId: user.id,
        },
      });

      if (error) {
        console.error('Payment intent creation failed:', error);
        throw error;
      }

      if (data?.client_secret) {
        setClientSecret(data.client_secret);
        console.log('Payment intent created successfully');
        return data;
      } else {
        throw new Error('No client secret received');
      }
    } catch (error: any) {
      console.error('Payment intent creation failed:', error);
      toast({
        title: 'Zahlungsfehler',
        description: error.message || 'Die Zahlung konnte nicht vorbereitet werden.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string, userId: string, paymentIntentId?: string) => {
    try {
      console.log('Handling payment success for order:', orderId);

      // Update payment status using Payment Intent ID
      const { error: updateError } = await supabase.rpc('update_order_payment_status', {
        p_order_id: orderId,
        p_payment_status: 'paid',
        p_stripe_session_id: paymentIntentId
      });

      if (updateError) {
        console.error('Failed to update order payment status:', updateError);
        throw updateError;
      }

      // Try to approve referral credits for this order
      await approveReferralCredits(orderId, userId);

      toast({
        title: 'Zahlung erfolgreich!',
        description: 'Ihre Bestellung wurde erfolgreich bezahlt.',
      });

      console.log('Payment success handled successfully');
    } catch (error) {
      console.error('Failed to handle payment success:', error);
    }
  };

  const resetPaymentState = () => {
    setClientSecret(null);
    setIsProcessingPayment(false);
  };

  return {
    createPaymentIntent,
    handlePaymentSuccess,
    resetPaymentState,
    isProcessingPayment,
    clientSecret,
  };
};
