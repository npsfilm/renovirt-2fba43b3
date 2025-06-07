
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/hooks/usePayment';
import { useOrderCreation } from '@/hooks/useOrderCreation';
import { useOrderData } from '@/hooks/useOrderData';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
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
  const [currentOrderData, setCurrentOrderData] = useState<OrderData | null>(null);

  const { user } = useAuth();
  const { createPaymentIntent, handlePaymentSuccess } = usePayment();
  const { packages, addOns } = useOrderData();
  const { createOrder, createOrderAfterPayment } = useOrderCreation(packages, addOns);
  const { calculateTotalPrice } = useOrders();
  const userCreditsResult = useUserCredits();
  const { credits, isLoading: creditsLoading } = userCreditsResult;
  const { toast } = useToast();

  useEffect(() => {
    // Guard condition: only calculate pricing if orderData has required fields and credits are loaded
    if (!orderData || !orderData.extras || !orderData.files || creditsLoading) {
      return;
    }

    // Use the same calculation as in PriceSummary
    const grossPrice = calculateTotalPrice(orderData);
    const creditsDiscount = Math.min(credits || 0, grossPrice);
    const calculatedFinalPrice = Math.max(0, grossPrice - creditsDiscount);
    
    setFinalPrice(calculatedFinalPrice);

    // Automatically use all available credits if possible
    if (credits && grossPrice > 0) {
      setCreditsToUse(Math.min(credits, creditsDiscount));
    } else {
      setCreditsToUse(0);
    }
  }, [orderData, credits, creditsLoading, calculateTotalPrice]);

  useEffect(() => {
    // Check if the order can proceed based on the acceptance of terms
    setCanProceed(orderData.acceptedTerms);
  }, [orderData.acceptedTerms]);

  const handlePaymentModalSuccess = async (paymentIntentId: string) => {
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
    setCurrentOrderData(null); // Clear the order data
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

      if (paymentMethod === 'stripe' && finalPrice > 0) {
        // For Stripe payments, prepare for payment but don't create order yet
        setCurrentOrderData(secureOrderData);
        
        // Create payment intent with a temporary order ID
        const paymentData = await createPaymentIntent({
          orderId: 'temp-stripe-order',
          amount: finalPrice,
          currency: 'eur',
        });

        setClientSecret(paymentData.client_secret);
        setShowPaymentModal(true);
      } else {
        // For invoice payment or zero amount, create the order immediately
        const createdOrder = await createOrder({
          orderData: secureOrderData,
          paymentMethod: paymentMethod as 'stripe' | 'invoice'
        });

        toast({
          title: 'Bestellung erfolgreich!',
          description: paymentMethod === 'invoice' 
            ? 'Ihre Bestellung wurde aufgegeben. Sie erhalten eine Rechnung per E-Mail.' 
            : 'Ihre kostenlose Bestellung wurde aufgegeben.',
        });
        onNext();
      }

      logSecurityEvent('order_creation_success', { 
        userId: user.id,
        paymentMethod
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
