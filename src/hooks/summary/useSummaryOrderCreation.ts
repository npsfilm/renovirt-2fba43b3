
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
  const { createOrder, createOrderAfterPayment } = useOrderCreation(packages, addOns);
  const { toast } = useToast();

  const handleSubmitOrder = async (
    orderData: OrderData,
    paymentMethod: 'invoice',
    creditsToUse: number,
    finalPrice: number,
    canProceed: boolean,
    setIsProcessing: (processing: boolean) => void,
    initiateStripePayment: null,
    onNext: () => void
  ) => {
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

      // For invoice payment, create the order immediately
      {
        await createOrder({
          orderData: secureOrderData,
          paymentMethod: paymentMethod
        });

        toast({
          title: 'Bestellung erfolgreich!',
          description: finalPrice > 0 
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
    handleSubmitOrder,
    createOrderAfterPayment
  };
};
