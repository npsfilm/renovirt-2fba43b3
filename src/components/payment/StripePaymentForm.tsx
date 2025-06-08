
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';
import { PaymentIcons } from '@/components/payment/PaymentIcons';
import { usePayment } from '@/hooks/usePayment';

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
  const { verifyPayment } = usePayment();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe ist noch nicht geladen. Bitte versuchen Sie es erneut.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Bestätige Zahlung...');
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Zahlungsfehler:', error);
        onError(error.message || 'Zahlung fehlgeschlagen');
        toast({
          title: 'Zahlungsfehler',
          description: error.message || 'Die Zahlung konnte nicht verarbeitet werden.',
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Zahlung erfolgreich:', paymentIntent.id);
        
        try {
          await verifyPayment(paymentIntent.id);
        } catch (verifyError) {
          console.error('Zahlungsverifikation fehlgeschlagen:', verifyError);
        }

        onSuccess(paymentIntent.id);
        toast({
          title: 'Zahlung erfolgreich!',
          description: 'Ihre Bestellung wurde erfolgreich bezahlt.',
        });
      }
    } catch (error: any) {
      console.error('Unerwarteter Zahlungsfehler:', error);
      onError(error.message || 'Ein unerwarteter Fehler ist aufgetreten');
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
