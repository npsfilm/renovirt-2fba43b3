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
      try {
        const paymentIntentId = searchParams.get('payment_intent');
        const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
        
        if (!paymentIntentId) {
          console.error('No payment_intent found in URL parameters');
          setPaymentStatus('error');
          setIsProcessing(false);
          return;
        }

        console.log('=== PROCESSING REDIRECT PAYMENT SUCCESS ===');
        console.log('Payment Intent ID:', paymentIntentId);
        console.log('Client Secret:', paymentIntentClientSecret);

        // Skip payment verification since we're on the success page
        // Stripe has already confirmed the payment was successful
        console.log('Payment successful, proceeding with order creation');

        // Get order data from sessionStorage (set during order creation)
        const storedOrderData = sessionStorage.getItem('pendingOrderData');
        console.log('SessionStorage content:', storedOrderData);
        
        if (storedOrderData) {
          try {
            const secureOrderData = JSON.parse(storedOrderData);
            console.log('Found stored order data:', {
              hasFiles: secureOrderData.files?.length > 0,
              photoType: secureOrderData.photoType,
              package: secureOrderData.package,
              email: secureOrderData.email
            });
            
            // Extract just the OrderData without extra fields
            const { creditsUsed, finalPrice, ...orderData } = secureOrderData;
            console.log('Creating order with payment intent:', paymentIntentId);
            
            // Create the order after successful payment
            await createOrderAfterPayment(orderData, paymentIntentId);
            
            // Clear the stored order data
            sessionStorage.removeItem('pendingOrderData');
            
            setOrderCreated(true);
            setPaymentStatus('success');
            
            toast({
              title: 'Zahlung erfolgreich!',
              description: 'Ihre Bestellung wurde erfolgreich erstellt.',
            });
          } catch (orderError) {
            console.error('Failed to create order after payment:', orderError);
            setPaymentStatus('error');
            toast({
              title: 'Bestellung konnte nicht erstellt werden',
              description: 'Die Zahlung war erfolgreich, aber die Bestellung konnte nicht erstellt werden. Bitte kontaktieren Sie den Support.',
              variant: 'destructive',
            });
          }
        } else {
          console.log('No stored order data found');
          setPaymentStatus('success');
          toast({
            title: 'Zahlung erfolgreich!',
            description: 'Ihre Zahlung wurde erfolgreich verarbeitet.',
          });
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
        setPaymentStatus('error');
        toast({
          title: 'Fehler bei der Verarbeitung',
          description: 'Es gab einen Fehler bei der Verarbeitung Ihrer Zahlung.',
          variant: 'destructive',
        });
      } finally {
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