
import React, { useState, useEffect } from 'react';
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

const StripePaymentForm = ({
  onSuccess,
  onError,
  amount,
  isLoading = false
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementsReady, setIsElementsReady] = useState(false);
  const { toast } = useToast();
  const { verifyPayment } = usePayment();

  useEffect(() => {
    if (stripe && elements) {
      setIsElementsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      onError('Stripe ist noch nicht geladen. Bitte versuchen Sie es erneut.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Bestätige Zahlung...');
      
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: 'auto',
              email: 'auto',
            },
          },
        },
        redirect: 'if_required', // Wichtig für PayPal und andere Redirect-Methoden
      });
      
      if (result.error) {
        console.error('Zahlungsfehler:', result.error);
        
        // PayPal-spezifische Fehlerbehandlung
        if (result.error.code === 'payment_intent_authentication_failure' && 
            result.error.message?.includes('paypal')) {
          onError('PayPal-Zahlung wurde abgebrochen oder ist fehlgeschlagen. Bitte versuchen Sie es erneut.');
        } else if (result.error.code === 'card_declined' && 
                   result.error.decline_code === 'generic_decline' &&
                   result.error.payment_method?.type === 'paypal') {
          onError('PayPal-Zahlung wurde abgelehnt. Bitte überprüfen Sie Ihr PayPal-Konto oder wählen Sie eine andere Zahlungsmethode.');
        } else if (result.error.type === 'validation_error' && 
                   result.error.message?.includes('paypal')) {
          onError('PayPal-Validierungsfehler. Bitte überprüfen Sie Ihre PayPal-Anmeldedaten.');
        } else {
          onError(result.error.message || 'Zahlung fehlgeschlagen');
        }
        
        toast({
          title: 'Zahlungsfehler',
          description: result.error.message || 'Die Zahlung konnte nicht verarbeitet werden.',
          variant: 'destructive'
        });
      } else if (result.paymentIntent) {
        // Direkter Erfolg (meist bei Kreditkarten)
        if (result.paymentIntent.status === 'succeeded') {
          console.log('Zahlung erfolgreich:', result.paymentIntent.id);
          try {
            await verifyPayment(result.paymentIntent.id);
          } catch (verifyError) {
            console.error('Zahlungsverifikation fehlgeschlagen:', verifyError);
          }
          onSuccess(result.paymentIntent.id);
          toast({
            title: 'Zahlung erfolgreich!',
            description: 'Ihre Bestellung wurde erfolgreich bezahlt.'
          });
        }
      }
      // Wenn kein Error und kein PaymentIntent, dann erfolgt ein Redirect (z.B. PayPal)
      // In diesem Fall wird der Benutzer zu PayPal weitergeleitet und kommt über die return_url zurück
      
    } catch (error: any) {
      console.error('Unerwarteter Zahlungsfehler:', error);
      
      // PayPal-spezifische Fehlerbehandlung auch im catch
      if (error.message?.includes('paypal') || error.message?.includes('PayPal')) {
        onError('PayPal-Integration-Fehler. Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.');
      } else {
        onError(error.message || 'Ein unerwarteter Fehler ist aufgetreten');
      }
      
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (!stripe || !elements) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Zahlungsformular wird geladen...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="py-[8px]">
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
          <div className="min-h-[200px] border rounded-lg p-4">
            {isElementsReady ? (
              <PaymentElement
                options={{
                  layout: {
                    type: 'accordion',
                    defaultCollapsed: false,
                    radios: false,
                    spacedAccordionItems: false
                  },
                  wallets: {
                    applePay: 'auto',
                    googlePay: 'auto',
                  },
                  paymentMethodOrder: ['card', 'paypal', 'klarna', 'sepa_debit'],
                  fields: {
                    billingDetails: {
                      name: 'auto',
                      email: 'auto',
                      address: {
                        country: 'never',
                        line1: 'auto',
                        line2: 'auto',
                        city: 'auto',
                        state: 'never',
                        postalCode: 'auto',
                      },
                    }
                  },
                  terms: {
                    card: 'auto',
                    sepaDebit: 'auto',
                    paypal: 'auto',
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-[150px]">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Zahlungsfelder werden geladen...</p>
                </div>
              </div>
            )}
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
            disabled={!stripe || !elements || isProcessing || isLoading || !isElementsReady}
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
