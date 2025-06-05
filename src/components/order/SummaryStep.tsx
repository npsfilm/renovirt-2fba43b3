
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import OrderSummaryDetails from './summary/OrderSummaryDetails';
import PaymentMethodSelector from './summary/PaymentMethodSelector';
import TermsAcceptance from './summary/TermsAcceptance';
import PriceSummary from './summary/PriceSummary';
import { useOrders } from '@/hooks/useOrders';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { OrderData } from '@/utils/orderValidation';

interface SummaryStepProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SummaryStep = ({ orderData, onUpdateData, onNext, onPrev }: SummaryStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');
  const [creditsToUse, setCreditsToUse] = useState(0);
  const [isProcessingCredits, setIsProcessingCredits] = useState(false);
  
  const { createOrder, isCreatingOrder, calculateTotalPrice } = useOrders();
  const { processPayment, isProcessingPayment } = usePayment();
  const { user } = useAuth();
  const { toast } = useToast();

  const canProceed = orderData.acceptedTerms && orderData.email && user;
  const basePrice = calculateTotalPrice(orderData);
  const creditDiscount = creditsToUse * 1;
  const finalPrice = Math.max(0, basePrice - creditDiscount);

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

      // Create order with updated price - create object directly without schema parsing
      const orderDataWithCredits: OrderData = {
        email: orderData.email,
        contactPerson: orderData.contactPerson,
        company: orderData.company,
        photoType: orderData.photoType,
        package: orderData.package,
        imageCount: orderData.imageCount,
        files: orderData.files || [], // Provide default if undefined
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
      
      if (paymentMethod === 'stripe' && finalPrice > 0) {
        // Process Stripe payment for remaining amount
        await processPayment({
          orderId: order.id,
          amount: finalPrice,
          currency: 'eur'
        });
        
        toast({
          title: "Weiterleitung zur Zahlung",
          description: finalPrice > 0 ? 
            "Sie werden zur sicheren Stripe-Zahlungsseite weitergeleitet." :
            "Ihre Bestellung wird verarbeitet.",
        });
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

  const isProcessing = isCreatingOrder || isProcessingPayment || isProcessingCredits;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Letzter Check: Ihre Bestellung</h1>
        <p className="text-gray-600">Bitte überprüfen Sie Ihre Auswahl. Mit Klick auf "Kostenpflichtig bestellen" wird die Bestellung verbindlich.</p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800">
            Bitte loggen Sie sich ein, um eine Bestellung aufzugeben. 
            <a href="/auth" className="font-medium underline ml-1">Jetzt anmelden</a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderSummaryDetails orderData={orderData} onUpdateData={onUpdateData} />
          <PaymentMethodSelector paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          <TermsAcceptance 
            acceptedTerms={orderData.acceptedTerms} 
            onTermsChange={(accepted) => onUpdateData({ acceptedTerms: accepted })} 
          />
        </div>

        <div>
          <PriceSummary 
            orderData={orderData} 
            creditsToUse={creditsToUse}
            onCreditsChange={setCreditsToUse}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          ← Zurück zum Paket
        </Button>
        <Button 
          onClick={handleSubmitOrder}
          disabled={!canProceed || isProcessing}
          className="min-w-[200px] bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? "Wird erstellt..." : 
           finalPrice > 0 ? (paymentMethod === 'stripe' ? "Zur Zahlung →" : "Kostenpflichtig bestellen →") :
           "Kostenlos bestellen →"}
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
