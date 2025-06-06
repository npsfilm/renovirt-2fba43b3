import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
import { useOrderCreation } from '@/hooks/useOrderCreation';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useToast } from '@/hooks/use-toast';
import { calculateOrderPricing } from '@/utils/orderPricing';
import { withCSRFProtection } from '@/utils/csrfProtection';
import { validateAdminOperation } from '@/utils/enhancedSecurityValidation';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryStepLogic = (orderData: OrderData, onNext: () => void) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');
  const [creditsToUse, setCreditsToUse] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const { user } = useAuth();
  const { createPaymentIntent, handlePaymentSuccess } = usePayment();
  const { createOrder } = useOrderCreation();
  const { credits, isLoading: creditsLoading } = useUserCredits();
  const { toast } = useToast();

  useEffect(() => {
    // Guard condition: only calculate pricing if orderData has required fields and credits are loaded
    if (!orderData || !orderData.extras || !orderData.files || creditsLoading) {
      return;
    }

    const { calculatedPrice, creditsDiscount } = calculateOrderPricing(orderData, credits || 0);
    setFinalPrice(calculatedPrice);

    // Automatically use all available credits if possible
    if (credits && calculatedPrice > 0) {
      setCreditsToUse(Math.min(credits, creditsDiscount));
    } else {
      setCreditsToUse(0);
    }
  }, [orderData, credits, creditsLoading]);

  useEffect(() => {
    // Check if the order can proceed based on the acceptance of terms
    setCanProceed(orderData.acceptedTerms);
  }, [orderData.acceptedTerms]);

  const handlePaymentModalSuccess = async (paymentIntentId: string) => {
    setShowPaymentModal(false);
    if (user) {
      await handlePaymentSuccess('temp-order-id', user.id, paymentIntentId);
      toast({
        title: 'Zahlung erfolgreich!',
        description: 'Ihre Bestellung wurde erfolgreich bezahlt.',
      });
      onNext();
    }
  };

  const handlePaymentModalError = (error: string) => {
    setShowPaymentModal(false);
    toast({
      title: 'Zahlungsfehler',
      description: error || 'Die Zahlung konnte nicht verarbeitet werden.',
      variant: 'destructive',
    });
  };

  const handleSubmitOrder = async () => {
    if (!user) {
      toast({
        title: 'Anmeldung erforderlich',
        description: 'Sie müssen angemeldet sein, um eine Bestellung aufzugeben.',
        variant: 'destructive',
      });
      return;
    }

    if (!canProceed) {
      toast({
        title: 'Unvollständige Angaben',
        description: 'Bitte überprüfen Sie Ihre Angaben und akzeptieren Sie die AGB.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Enhanced security validation for order creation
      logSecurityEvent('order_creation_attempt', { 
        userId: user.id,
        paymentMethod,
        creditsUsed: creditsToUse,
        finalPrice
      });

      // Prepare secure order data with CSRF protection
      const secureOrderData = withCSRFProtection({
        ...orderData,
        creditsUsed: creditsToUse,
        finalPrice,
      });

      secureLog('Creating order with secure data', {
        hasFiles: orderData.files.length > 0,
        creditsUsed: creditsToUse,
        paymentMethod
      });

      // Create the order
      const createdOrder = await createOrder({
        orderData: secureOrderData,
        paymentMethod: paymentMethod as 'stripe' | 'invoice'
      });

      if (paymentMethod === 'stripe' && finalPrice > 0) {
        // Create payment intent for Stripe payments
        const paymentData = await createPaymentIntent({
          orderId: createdOrder.id,
          amount: finalPrice,
          currency: 'eur',
        });

        setClientSecret(paymentData.client_secret);
        setShowPaymentModal(true);
      } else {
        // Invoice payment or zero amount
        toast({
          title: 'Bestellung erfolgreich!',
          description: paymentMethod === 'invoice' 
            ? 'Ihre Bestellung wurde aufgegeben. Sie erhalten eine Rechnung per E-Mail.' 
            : 'Ihre kostenlose Bestellung wurde aufgegeben.',
        });
        onNext();
      }

      logSecurityEvent('order_creation_success', { 
        orderId: createdOrder.id,
        userId: user.id 
      });

    } catch (error: any) {
      console.error('Order creation failed:', error);
      
      logSecurityEvent('order_creation_failed', { 
        userId: user.id,
        error: error.message 
      });

      toast({
        title: 'Fehler bei der Bestellung',
        description: error.message || 'Die Bestellung konnte nicht aufgegeben werden.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
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
    handleSubmitOrder,
    handlePaymentModalSuccess,
    handlePaymentModalError
  };
};
