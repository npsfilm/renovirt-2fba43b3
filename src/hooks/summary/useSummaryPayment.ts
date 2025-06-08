
import { useState } from 'react';
import { usePayment } from '@/hooks/usePayment';
import { useToast } from '@/hooks/use-toast';

export const useSummaryPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const { initiatePayment } = usePayment();
  const { toast } = useToast();

  const handlePaymentModalSuccess = (paymentIntentId: string, createOrderAfterPayment: any, onNext: () => void) => {
    toast({
      title: 'Zahlung erfolgreich!',
      description: 'Ihre Bestellung wird jetzt verarbeitet.',
    });
    setShowPaymentModal(false);
    setIsProcessing(false);
    createOrderAfterPayment(paymentIntentId);
    onNext();
  };

  const handlePaymentModalError = (error: string) => {
    toast({
      title: 'Zahlungsfehler',
      description: error,
      variant: 'destructive',
    });
    setShowPaymentModal(false);
    setIsProcessing(false);
  };

  const initiateStripePayment = async (finalPrice: number, secureOrderData: any) => {
    try {
      setIsProcessing(true);
      const paymentData = await initiatePayment(finalPrice, 'temp-order-id');
      setClientSecret(paymentData.clientSecret);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setIsProcessing(false);
      throw error;
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    showPaymentModal,
    setShowPaymentModal,
    isProcessing,
    setIsProcessing,
    clientSecret,
    handlePaymentModalSuccess,
    handlePaymentModalError,
    initiateStripePayment
  };
};
