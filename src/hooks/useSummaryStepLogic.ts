import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrderData } from '@/hooks/useOrderData';
import { useOrderCreation } from './useOrderCreation';
import { useToast } from './use-toast';
import { calculateOrderTotal } from '@/utils/orderPricing';
import { logSecurityEvent } from '@/utils/secureLogging';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryStepLogic = (orderData: OrderData, onNext: () => void) => {
  const [creditsToUse, setCreditsToUse] = useState(0);
  const { user } = useAuth();
  const { packages, addOns, packagesLoading, addOnsLoading } = useOrderData();
  const { createOrder } = useOrderCreation(packages, addOns);
  const { toast } = useToast();
  
  const [paymentMethod] = useState<'invoice'>('invoice');
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize expensive calculations to prevent infinite loops
  const totalPrice = useMemo(() => {
    if (!packages || !addOns) return 0;
    return calculateOrderTotal(orderData, packages, addOns);
  }, [orderData, packages, addOns]);
  
  const finalPrice = useMemo(() => Math.max(0, totalPrice - creditsToUse), [totalPrice, creditsToUse]);
  
  const canProceed = useMemo(() => {
    const emailFromUser = user?.email?.trim() || '';
    const emailFromOrder = orderData.email?.trim() || '';
    const emailToUse = emailFromOrder || emailFromUser;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse);

    return !!(
      !packagesLoading &&
      !addOnsLoading &&
      orderData.photoType &&
      orderData.package &&
      orderData.acceptedTerms &&
      emailValid
    );
  }, [user?.email, orderData.photoType, orderData.package, orderData.acceptedTerms, orderData.email, packagesLoading, addOnsLoading]);

  const handleSubmit = useCallback((onOrderSuccess?: (orderId: string) => void) => {
    const executeOrder = async () => {
      // Determine effective email (orderData.email or fallback to user.email)
      const emailFromUser = user?.email?.trim() || '';
      const emailFromOrder = orderData.email?.trim() || '';
      const emailToUse = emailFromOrder || emailFromUser;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse);

      console.log('🔥 handleSubmit started', { 
        canProceed,
        finalPrice,
        creditsToUse,
        emailFromOrder,
        emailFromUser,
        emailToUse,
        emailValid
      });

      if (!user) {
        console.log('❌ No user found');
        toast({
          title: 'Anmeldung erforderlich',
          description: 'Sie müssen angemeldet sein, um eine Bestellung aufzugeben.',
          variant: 'destructive',
        });
        return;
      }

      if (!canProceed || !emailValid) {
        console.log('❌ Validation failed', { canProceed, emailToUse, emailValid });
        toast({
          title: 'Unvollständige Angaben',
          description: 'Bitte überprüfen Sie Ihre Angaben, E-Mail-Adresse und akzeptieren Sie die AGB.',
          variant: 'destructive',
        });
        return;
      }

      setIsProcessing(true);
      console.log('🚀 Order creation starting');

      try {
        logSecurityEvent('order_creation_attempt', { 
          userId: user.id,
          paymentMethod,
          creditsUsed: creditsToUse,
          finalPrice
        });

        const effectiveOrderData = { ...orderData, email: emailToUse } as OrderData;

        const order = await createOrder({
          orderData: effectiveOrderData,
          paymentMethod
        });

        console.log('✅ Order created successfully', { orderId: order.id });

        logSecurityEvent('order_creation_success', { 
          userId: user.id,
          paymentMethod,
          orderId: order.id
        });

        toast({
          title: 'Bestellung erfolgreich!',
          description: finalPrice > 0 
            ? 'Ihre Bestellung wurde aufgegeben. Sie erhalten eine Rechnung per E-Mail.' 
            : 'Ihre kostenlose Bestellung wurde aufgegeben.',
        });
        
        console.log('🎯 Calling onNext/onOrderSuccess with orderId:', order.id);
        if (onOrderSuccess && order.id) {
          onOrderSuccess(order.id);
        } else {
          onNext();
        }

      } catch (error: any) {
        console.error('❌ Order creation failed:', error);
        
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
        console.log('🏁 handleSubmit finished');
      }
    };

    executeOrder();
  }, [user, createOrder, toast, paymentMethod, creditsToUse, finalPrice, canProceed, orderData, onNext]);

  return {
    paymentMethod,
    creditsToUse,
    setCreditsToUse,
    canProceed,
    finalPrice,
    isProcessing,
    handleSubmitOrder: handleSubmit
  };
};