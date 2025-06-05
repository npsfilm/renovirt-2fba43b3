
import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { OrderData } from '@/utils/orderValidation';

export const useSummaryStepLogic = (orderData: OrderData, onNext: () => void) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');
  const [creditsToUse, setCreditsToUse] = useState(0);
  const [isProcessingCredits, setIsProcessingCredits] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  
  const { createOrder, isCreatingOrder, calculateTotalPrice } = useOrders();
  const { createPaymentIntent, handlePaymentSuccess, isProcessingPayment, clientSecret } = usePayment();
  const { user } = useAuth();
  const { toast } = useToast();

  const canProceed = orderData.acceptedTerms && orderData.email && !!user;
  const basePrice = calculateTotalPrice(orderData);
  const creditDiscount = creditsToUse * 1;
  const finalPrice = Math.max(0, basePrice - creditDiscount);
  const isProcessing = isCreatingOrder || isProcessingPayment || isProcessingCredits;

  const handleSubmitOrder = async () => {
    if (!canProceed) return;

    try {
      setIsProcessingCredits(true);

      // Use credits if applicable
      if (creditsToUse > 0) {
        const { data: creditResult, error: creditError } = await supabase.rpc('use_user_credits', {
          user_uuid: user.id,
          amount_to_use: creditsToUse
        });

        if (creditError) throw creditError;

        const result = creditResult as { success?: boolean; error?: string };
        if (!result?.success) {
          throw new Error(result?.error || 'Failed to use credits');
        }

        toast({
          title: "Credits verwendet",
          description: `${creditsToUse} Credits wurden erfolgreich angewendet.`,
        });
      }

      // Create order with updated price
      const orderDataWithCredits: OrderData = {
        email: orderData.email,
        contactPerson: orderData.contactPerson,
        company: orderData.company,
        photoType: orderData.photoType,
        package: orderData.package,
        imageCount: orderData.imageCount,
        files: orderData.files || [],
        extras: orderData.extras,
        specialRequests: orderData.specialRequests,
        acceptedTerms: orderData.acceptedTerms,
        creditsUsed: creditsToUse,
        originalPrice: basePrice,
        finalPrice: finalPrice,
        watermarkFile: orderData.watermarkFile,
        couponCode: orderData.couponCode
      };

      const order = await createOrder(orderDataWithCredits, paymentMethod);
      setCurrentOrderId(order.id);
      
      if (paymentMethod === 'stripe' && finalPrice > 0) {
        // Create payment intent and show payment modal
        await createPaymentIntent({
          orderId: order.id,
          amount: finalPrice,
          currency: 'eur'
        });
        setShowPaymentModal(true);
      } else if (paymentMethod === 'stripe' && finalPrice === 0) {
        // Order fully paid with credits - mark as paid
        const { error: updateError } = await supabase.rpc('update_order_payment_status', {
          p_order_id: order.id,
          p_payment_status: 'paid'
        });

        if (updateError) throw updateError;

        toast({
          title: "Bestellung erfolgreich erstellt!",
          description: "Ihre Bestellung wurde vollständig mit Credits bezahlt.",
        });
        onNext();
      } else {
        // Invoice payment
        toast({
          title: "Bestellung erfolgreich erstellt!",
          description: "Sie erhalten in Kürze eine Rechnung per E-Mail.",
        });
        onNext();
      }
    } catch (error: any) {
      console.error('Order submission failed:', error);
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist bei der Bestellung aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingCredits(false);
    }
  };

  const handlePaymentModalSuccess = async (paymentIntentId: string) => {
    if (currentOrderId && user) {
      await handlePaymentSuccess(currentOrderId, user.id, paymentIntentId);
      setShowPaymentModal(false);
      onNext();
    }
  };

  const handlePaymentModalError = (error: string) => {
    console.error('Payment modal error:', error);
    setShowPaymentModal(false);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    creditsToUse,
    setCreditsToUse,
    showPaymentModal,
    setShowPaymentModal,
    currentOrderId,
    canProceed,
    basePrice,
    finalPrice,
    isProcessing,
    clientSecret,
    handleSubmitOrder,
    handlePaymentModalSuccess,
    handlePaymentModalError
  };
};
