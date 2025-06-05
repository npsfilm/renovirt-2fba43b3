
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

export const usePayment = () => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { approveReferralCredits } = useReferralCredits();

  const processPayment = async (paymentData: PaymentData) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setIsProcessingPayment(true);

    try {
      console.log('Processing payment for order:', paymentData.orderId);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          userId: user.id,
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Payment processing failed:', error);
      toast({
        title: 'Zahlungsfehler',
        description: error.message || 'Die Zahlung konnte nicht verarbeitet werden.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string, userId: string) => {
    try {
      // Update payment status
      const { error: updateError } = await supabase.rpc('update_order_payment_status', {
        p_order_id: orderId,
        p_payment_status: 'paid'
      });

      if (updateError) throw updateError;

      // Try to approve referral credits for this order
      await approveReferralCredits(orderId, userId);

      toast({
        title: 'Zahlung erfolgreich!',
        description: 'Ihre Bestellung wurde erfolgreich bezahlt.',
      });
    } catch (error) {
      console.error('Failed to handle payment success:', error);
    }
  };

  return {
    processPayment,
    handlePaymentSuccess,
    isProcessingPayment,
  };
};
