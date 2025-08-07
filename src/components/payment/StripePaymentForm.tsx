
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
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const { toast } = useToast();
  const { verifyPayment } = usePayment();

  useEffect(() => {
    if (stripe && elements) {
      setIsElementsReady(true);
      
      // Add PaymentElement event listeners for better debugging
      const paymentElement = elements.getElement('payment');
      if (paymentElement) {
        console.log('=== PAYMENT ELEMENT READY ===');
        
        paymentElement.on('ready', () => {
          console.log('PaymentElement ready event fired');
        });
        
        paymentElement.on('focus', () => {
          console.log('PaymentElement focused');
        });
        
        paymentElement.on('blur', () => {
          console.log('PaymentElement blurred');
        });
        
        paymentElement.on('change', (event) => {
          console.log('=== PAYMENT ELEMENT CHANGE ===');
          console.log('Event details:', {
            complete: event.complete,
            empty: event.empty,
            value: event.value,
            collapsed: event.collapsed
          });
          
          // CRITICAL FIX: Weniger strenge Validierung für redirect-basierte Zahlungen
          // PayPal, Klarna etc. sind nie "complete" vor dem Redirect
          setPaymentMethodSelected(!event.empty);
        });
        
        paymentElement.on('loaderror', (event) => {
          console.error('=== PAYMENT ELEMENT LOAD ERROR ===');
          console.error('Error details:', event.error);
        });
      }
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
      console.log('=== STRIPE PAYMENT SUBMISSION START ===');
      console.log('Current URL:', window.location.href);
      console.log('Return URL will be:', `${window.location.origin}/payment/success`);
      console.log('Payment method selected:', paymentMethodSelected);
      
      // Check if PaymentElement is ready
      const paymentElement = elements.getElement('payment');
      if (!paymentElement) {
        throw new Error('PaymentElement nicht verfügbar');
      }
      
      console.log('PaymentElement ready, submitting elements first...');
      
      // CRITICAL FIX: Submit elements first to ensure payment method is attached
      const submitResult = await elements.submit();
      if (submitResult.error) {
        console.error('=== ELEMENTS SUBMIT ERROR ===');
        console.error('Submit error:', submitResult.error);
        throw new Error(submitResult.error.message || 'Formularvalidierung fehlgeschlagen');
      }
      
      console.log('Elements submitted successfully, confirming payment...');
      
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
        // CRITICAL FIX: Allow all redirects for PayPal, Apple Pay, Google Pay
        redirect: 'always', // Changed from 'if_required' to 'always'
      });
      
      console.log('=== STRIPE PAYMENT RESULT ===');
      console.log('Result:', result);
      
      if (result.error) {
        console.error('=== PAYMENT ERROR ===');
        console.error('Error details:', {
          code: result.error.code,
          type: result.error.type,
          message: result.error.message,
          decline_code: result.error.decline_code,
          payment_method: result.error.payment_method,
          full_error: result.error
        });
        
        // Enhanced error handling with more specific messages
        let errorMessage = result.error.message || 'Zahlung fehlgeschlagen';
        
        if (result.error.code === 'payment_intent_authentication_failure') {
          errorMessage = 'Zahlungsauthentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.';
        } else if (result.error.code === 'card_declined') {
          if (result.error.decline_code === 'generic_decline') {
            errorMessage = 'Ihre Karte wurde abgelehnt. Bitte überprüfen Sie Ihre Kartendaten oder verwenden Sie eine andere Karte.';
          } else {
            errorMessage = `Karte wurde abgelehnt: ${result.error.decline_code}`;
          }
        } else if (result.error.type === 'validation_error') {
          errorMessage = 'Validierungsfehler. Bitte überprüfen Sie Ihre Eingaben.';
        } else if (result.error.code === 'payment_method_not_available') {
          errorMessage = 'Diese Zahlungsmethode ist nicht verfügbar. Bitte wählen Sie eine andere Option.';
        }
        
        onError(errorMessage);
        
        toast({
          title: 'Zahlungsfehler',
          description: errorMessage,
          variant: 'destructive'
        });
      } else if ('paymentIntent' in result && result.paymentIntent) {
        const paymentIntent = result.paymentIntent as any;
        console.log('=== PAYMENT INTENT RECEIVED ===');
        console.log('PaymentIntent status:', paymentIntent.status);
        console.log('PaymentIntent ID:', paymentIntent.id);
        
        // Direct success (usually for credit cards without 3D Secure)
        if (paymentIntent.status === 'succeeded') {
          console.log('=== DIRECT PAYMENT SUCCESS ===');
          try {
            await verifyPayment(paymentIntent.id);
            console.log('Payment verification successful');
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            // Continue anyway as payment succeeded on Stripe side
          }
          onSuccess(paymentIntent.id);
          toast({
            title: 'Zahlung erfolgreich!',
            description: 'Ihre Bestellung wurde erfolgreich bezahlt.'
          });
        } else if (paymentIntent.status === 'requires_action') {
          console.log('=== PAYMENT REQUIRES ACTION ===');
          // This should trigger additional authentication
          toast({
            title: 'Zusätzliche Authentifizierung erforderlich',
            description: 'Bitte folgen Sie den Anweisungen zur Zahlungsbestätigung.'
          });
        } else {
          console.log('=== UNEXPECTED PAYMENT STATUS ===');
          console.log('Status:', paymentIntent.status);
        }
      } else {
        // No error and no paymentIntent = redirect happening (PayPal, Apple Pay, Google Pay)
        console.log('=== REDIRECT PAYMENT INITIATED ===');
        console.log('User will be redirected to payment provider...');
        
        toast({
          title: 'Weiterleitung zur Zahlung',
          description: 'Sie werden zur Zahlungsseite weitergeleitet...'
        });
      }
      
    } catch (error: any) {
      console.error('=== UNEXPECTED PAYMENT ERROR ===');
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        full_error: error
      });
      
      let errorMessage = error.message || 'Ein unerwarteter Fehler ist aufgetreten';
      
      // Enhanced error categorization
      if (error.name === 'IntegrationError') {
        errorMessage = 'Integrationsfehler. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.';
      } else if (error.message?.toLowerCase().includes('network')) {
        errorMessage = 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.';
      } else if (error.message?.toLowerCase().includes('timeout')) {
        errorMessage = 'Zeitüberschreitung. Bitte versuchen Sie es erneut.';
      }
      
      onError(errorMessage);
      
      toast({
        title: 'Unerwarteter Fehler',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      console.log('=== PAYMENT SUBMISSION END ===');
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
            disabled={!stripe || !elements || isProcessing || isLoading || !isElementsReady || !paymentMethodSelected}
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
