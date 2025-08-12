
import { useAuth } from '@/hooks/useAuth';
import { useOrderCreation } from '@/hooks/useOrderCreation';
import { useOrderData } from '@/hooks/useOrderData';
import { useToast } from '@/hooks/use-toast';
import { withCSRFProtection } from '@/utils/csrfProtection';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryOrderCreation = () => {
  const { user } = useAuth();
  const { packages, addOns } = useOrderData();
  const { createOrder } = useOrderCreation(packages, addOns);
  const { toast } = useToast();

  const handleSubmitOrder = async (
    orderData: OrderData,
    paymentMethod: 'invoice',
    creditsToUse: number,
    finalPrice: number,
    canProceed: boolean,
    setIsProcessing: (processing: boolean) => void,
    initiateStripePayment: null,
    onNext: (orderId?: string) => void
  ) => {
    if (!user) {
      toast({
        title: 'Anmeldung erforderlich',
        description: 'Sie müssen angemeldet sein, um eine Bestellung aufzugeben.',
        variant: 'destructive',
      });
      return;
    }

    // Enhanced validation including email
    if (!canProceed || !orderData.email || !orderData.email.includes('@')) {
      toast({
        title: 'Unvollständige Angaben',
        description: 'Bitte überprüfen Sie Ihre Angaben, E-Mail-Adresse und akzeptieren Sie die AGB.',
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
        paymentMethod,
        email: orderData.email
      });

      // Create the order and get the order ID
      const order = await createOrder({
        orderData: secureOrderData,
        paymentMethod: paymentMethod
      });

      logSecurityEvent('order_creation_success', { 
        userId: user.id,
        paymentMethod,
        orderId: order.id
      });

      // Only proceed to next step if order was created successfully
      if (order && order.id) {
        toast({
          title: 'Bestellung erfolgreich!',
          description: finalPrice > 0 
            ? 'Ihre Bestellung wurde aufgegeben. Sie erhalten eine Rechnung per E-Mail.' 
            : 'Ihre kostenlose Bestellung wurde aufgegeben.',
        });
        
        // Pass the order ID to the next step
        onNext(order.id);
      } else {
        throw new Error('Bestellung wurde erstellt, aber keine Order-ID erhalten');
      }

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
    handleSubmitOrder
  };
};
