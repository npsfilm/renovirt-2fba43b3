
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrderData } from '@/hooks/useOrderData';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { useSummaryOrderCreation } from '@/hooks/summary/useSummaryOrderCreation';
import { useSummaryPayment } from '@/hooks/summary/useSummaryPayment';
import { secureLog } from '@/utils/secureLogging';
import { useToast } from '@/hooks/use-toast';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryStepLogic = (orderData: OrderData, onNext: () => void) => {
  const [creditsToUse, setCreditsToUse] = useState(0);
  const { user } = useAuth();
  const { packages, addOns } = useOrderData();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
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
  } = useSummaryPayment();

  const { handleSubmitOrder, createOrderAfterPayment } = useSummaryOrderCreation();

  const totalPrice = calculateOrderTotal(orderData, packages, addOns);
  const finalPrice = Math.max(0, totalPrice - creditsToUse);
  
  const canProceed = !!(
    orderData.photoType &&
    orderData.files.length > 0 &&
    orderData.package &&
    orderData.email &&
    orderData.acceptedTerms
  );

  const handleSubmit = () => {
    // Enhanced order handling with localStorage persistence for redirect payments
    if (paymentMethod === 'stripe' && finalPrice > 0) {
      // Store order context before initiating Stripe payment
      try {
        const orderDataForStorage = {
          ...orderData,
          creditsUsed: creditsToUse,
          finalPrice,
          paymentMethod: 'stripe',
          userId: user?.id,
          totalAmount: finalPrice
        };
        localStorage.setItem('pendingOrderData', JSON.stringify(orderDataForStorage));
        secureLog('Order data stored in localStorage for redirect payment', orderDataForStorage);
      } catch (error) {
        console.error('Failed to save pending order data to localStorage:', error);
        toast({ 
          variant: 'destructive', 
          title: 'Ein Fehler ist aufgetreten', 
          description: 'Bestelldaten konnten nicht für die Zahlung vorbereitet werden.' 
        });
        return;
      }
    }

    handleSubmitOrder(
      orderData,
      paymentMethod,
      creditsToUse,
      finalPrice,
      canProceed,
      setIsProcessing,
      initiateStripePayment,
      onNext
    );
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    secureLog('Handling successful non-redirect payment', { paymentIntentId });
    
    // Standardize the flow: redirect to success page for all Stripe payments
    // This ensures both redirect and non-redirect payments follow the same path
    navigate(`/payment/success?payment_intent=${paymentIntentId}&redirect_status=succeeded`);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    creditsToUse,
    setCreditsToUse,
    showPaymentModal,
    setShowPaymentModal,
    canProceed,
    finalPrice,
    isProcessing,
    clientSecret,
    handleSubmitOrder: handleSubmit,
    handlePaymentModalSuccess: handlePaymentSuccess,
    handlePaymentModalError
  };
};
