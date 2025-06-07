
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
import { useToast } from '@/hooks/use-toast';
import { logSecurityEvent } from '@/utils/secureLogging';

export const useSummaryPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentOrderData, setCurrentOrderData] = useState<any>(null);

  const { user } = useAuth();
  const { initiatePayment } = usePayment();
  const { toast } = useToast();

  const handlePaymentModalSuccess = async (paymentIntentId: string, createOrderAfterPayment: any, onNext: () => void) => {
    setShowPaymentModal(false);
    
    if (user && currentOrderData) {
      try {
        // Create the actual order in the database after successful payment
        await createOrderAfterPayment(currentOrderData, paymentIntentId);
        
        toast({
          title: 'Zahlung erfolgreich!',
          description: 'Ihre Bestellung wurde erfolgreich bezahlt und wird nun bearbeitet.',
        });
        onNext();
      } catch (error: any) {
        console.error('Failed to create order after payment:', error);
        toast({
          title: 'Fehler nach Zahlung',
          description: 'Die Zahlung war erfolgreich, aber es gab ein Problem beim Erstellen der Bestellung. Bitte kontaktieren Sie den Support.',
          variant: 'destructive',
        });
      }
    }
  };

  const handlePaymentModalError = (error: string) => {
    setShowPaymentModal(false);
    setCurrentOrderData(null);
    toast({
      title: 'Zahlungsfehler',
      description: error || 'Die Zahlung konnte nicht verarbeitet werden.',
      variant: 'destructive',
    });
  };

  const initiateStripePayment = async (finalPrice: number, secureOrderData: any) => {
    setCurrentOrderData(secureOrderData);
    
    // Create payment intent using the new initiatePayment method
    const paymentData = await initiatePayment(finalPrice, 'temp-stripe-order');

    setClientSecret(paymentData.client_secret);
    setShowPaymentModal(true);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    showPaymentModal,
    setShowPaymentModal,
    isProcessing,
    setIsProcessing,
    clientSecret,
    currentOrderData,
    handlePaymentModalSuccess,
    handlePaymentModalError,
    initiateStripePayment
  };
};
