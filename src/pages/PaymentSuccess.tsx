import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/hooks/usePayment';
import { useSummaryOrderCreation } from '@/hooks/summary/useSummaryOrderCreation';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { verifyPayment } = usePayment();
  const { createOrderAfterPayment } = useSummaryOrderCreation();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      const paymentIntentId = searchParams.get('payment_intent');
      const clientSecret = searchParams.get('payment_intent_client_secret');
      
      if (paymentIntentId && clientSecret) {
        const handleStripeRedirect = async () => {
          // Retrieve and parse the pendingOrderData from localStorage
          const pendingOrderDataString = localStorage.getItem('pendingOrderData');
          
          // Always clean up immediately to prevent refresh issues
          localStorage.removeItem('pendingOrderData'); 

          if (!pendingOrderDataString) {
            setPaymentStatus('error');
            toast({
              title: 'Fehler',
              description: 'Wichtige Bestelldaten wurden nicht gefunden. Ihre Zahlung war erfolgreich, aber bitte kontaktieren Sie den Support, um Ihre Bestellung zu bestätigen.',
              variant: 'destructive',
            });
            setIsProcessing(false);
            return;
          }

          try {
            const orderData = JSON.parse(pendingOrderDataString);
            console.log('=== PROCESSING REDIRECT PAYMENT SUCCESS ===');
            console.log('Payment Intent ID:', paymentIntentId);
            console.log('Found stored order data:', {
              hasFiles: orderData.files?.length > 0,
              photoType: orderData.photoType,
              package: orderData.package,
              email: orderData.email
            });
            
            // Payment was successful since we reached this redirect URL
            // No need to verify with Stripe API - the redirect itself confirms success
            console.log('Payment confirmed via redirect, creating order with payment intent:', paymentIntentId);
            
            // Extract order data without extra fields
            const { creditsUsed, finalPrice, paymentMethod, userId, totalAmount, ...cleanOrderData } = orderData;
            
            // Create the order after successful payment
            await createOrderAfterPayment(cleanOrderData, paymentIntentId);
            
            setOrderCreated(true);
            setPaymentStatus('success');
            
            toast({
              title: 'Zahlung erfolgreich!',
              description: 'Ihre Bestellung wurde erfolgreich erstellt.',
            });
          } catch (err) {
            console.error('Error processing Stripe redirect:', err);
            setPaymentStatus('error');
            toast({
              title: 'Unerwarteter Fehler',
              description: 'Ein unerwarteter Fehler ist bei der Verarbeitung Ihrer Bestellung aufgetreten.',
              variant: 'destructive',
            });
          } finally {
            setIsProcessing(false);
          }
        };

        await handleStripeRedirect();
      } else {
        console.error('No payment_intent found in URL parameters');
        setPaymentStatus('error');
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, verifyPayment, createOrderAfterPayment, toast]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Zahlung wird verarbeitet...</h2>
            <p className="text-gray-600 text-center">
              Bitte warten Sie, während wir Ihre Zahlung verarbeiten und Ihre Bestellung erstellen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-600">Fehler bei der Verarbeitung</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Es gab einen Fehler bei der Verarbeitung Ihrer Zahlung. Bitte kontaktieren Sie unseren Support.
            </p>
            <div className="space-y-2">
              <Button onClick={handleGoToDashboard} className="w-full">
                Zum Dashboard
              </Button>
              <Button onClick={() => navigate('/help')} variant="outline" className="w-full">
                Support kontaktieren
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-xl text-green-600">Zahlung erfolgreich!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {orderCreated 
              ? 'Ihre Zahlung wurde erfolgreich verarbeitet und Ihre Bestellung wurde erstellt. Sie erhalten in Kürze eine Bestätigungs-E-Mail.'
              : 'Ihre Zahlung wurde erfolgreich verarbeitet.'
            }
          </p>
          <div className="space-y-2">
            {orderCreated && (
              <Button onClick={handleGoToOrders} className="w-full">
                Meine Bestellungen ansehen
              </Button>
            )}
            <Button 
              onClick={handleGoToDashboard} 
              variant={orderCreated ? "outline" : "default"} 
              className="w-full"
            >
              Zum Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;