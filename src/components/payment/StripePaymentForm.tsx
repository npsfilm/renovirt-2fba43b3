
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';
import { PaymentIcons } from '@/components/payment/PaymentIcons';
import { supabase } from '@/integrations/supabase/client';

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
  isLoading?: boolean;
}

const StripePaymentForm = ({ onSuccess, onError, amount, isLoading = false }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe is not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Confirming payment...');
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment error:', error);
        onError(error.message || 'Payment failed');
        toast({
          title: 'Zahlungsfehler',
          description: error.message || 'Die Zahlung konnte nicht verarbeitet werden.',
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Verify payment with our backend
        try {
          const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
            body: { paymentIntentId: paymentIntent.id }
          });

          if (verifyError) {
            console.error('Payment verification error:', verifyError);
          }
        } catch (verifyError) {
          console.error('Failed to verify payment:', verifyError);
          // Don't fail the whole process if verification fails
        }

        onSuccess(paymentIntent.id);
        toast({
          title: 'Zahlung erfolgreich!',
          description: 'Ihre Bestellung wurde erfolgreich bezahlt.',
        });
      }
    } catch (error: any) {
      console.error('Unexpected payment error:', error);
      onError(error.message || 'An unexpected error occurred');
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Zahlung abschließen</CardTitle>
        <p className="text-sm text-gray-600">
          Betrag: <span className="font-semibold">{formatAmount(amount)}</span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <PaymentIcons />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="min-h-[200px]">
            <PaymentElement 
              options={{
                layout: 'tabs',
              }}
            />
          </div>
          
          <div className="flex items-center justify-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              <span>SSL verschlüsselt</span>
            </div>
            <span>•</span>
            <span>Powered by Stripe</span>
          </div>
          
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing || isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Zahlung wird verarbeitet...
              </>
            ) : (
              `${formatAmount(amount)} bezahlen`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
