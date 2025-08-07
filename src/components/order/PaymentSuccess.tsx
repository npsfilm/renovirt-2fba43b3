
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmPayment } = usePayment();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      console.log('=== PAYMENT SUCCESS PAGE LOADED ===');
      console.log('Current URL:', window.location.href);
      console.log('Search params:', window.location.search);
      
      // Extract all possible payment parameters
      const paymentIntent = searchParams.get('payment_intent');
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
      const redirectStatus = searchParams.get('redirect_status');
      const source = searchParams.get('source');
      const clientSecret = searchParams.get('client_secret');

      console.log('=== PAYMENT RETURN PARAMETERS ===');
      console.log('Payment Intent:', paymentIntent);
      console.log('Client Secret:', paymentIntentClientSecret ? 'Present' : 'Missing');
      console.log('Redirect Status:', redirectStatus);
      console.log('Source:', source);
      console.log('Additional Client Secret:', clientSecret ? 'Present' : 'Missing');
      console.log('User authenticated:', !!user);
      console.log('User ID:', user?.id);

      if (paymentIntent && user) {
        try {
          console.log('=== STARTING PAYMENT VERIFICATION ===');
          setIsVerifying(true);
          
          // Enhanced status handling for different payment methods
          if (redirectStatus === 'succeeded') {
            console.log('=== REDIRECT PAYMENT SUCCEEDED ===');
            console.log('Payment method likely: PayPal, Apple Pay, or Google Pay');
            
            const result = await confirmPayment(paymentIntent);
            console.log('Payment confirmation result:', result);
            
            toast({
              title: 'Zahlung erfolgreich!',
              description: 'Ihre Zahlung wurde erfolgreich verarbeitet.',
            });
            
            setVerificationComplete(true);
          } else if (redirectStatus === 'failed') {
            console.log('=== REDIRECT PAYMENT FAILED ===');
            toast({
              title: 'Zahlung fehlgeschlagen',
              description: 'Ihre Zahlung konnte nicht verarbeitet werden.',
              variant: 'destructive',
            });
            
            // Redirect back to order page after failure
            setTimeout(() => {
              console.log('Redirecting to order page due to payment failure');
              navigate('/order');
            }, 3000);
          } else if (redirectStatus === 'pending') {
            console.log('=== PAYMENT PENDING ===');
            toast({
              title: 'Zahlung ausstehend',
              description: 'Ihre Zahlung wird noch verarbeitet. Bitte warten Sie einen Moment.',
            });
            
            // Try to verify anyway
            try {
              const result = await confirmPayment(paymentIntent);
              console.log('Pending payment verification result:', result);
              setVerificationComplete(true);
            } catch (error) {
              console.error('Pending payment verification failed:', error);
              // Keep showing verification state
            }
          } else {
            // No redirect status or unknown status - attempt verification
            console.log('=== NO REDIRECT STATUS OR UNKNOWN STATUS ===');
            console.log('Attempting direct payment verification...');
            
            try {
              const result = await confirmPayment(paymentIntent);
              console.log('Direct payment verification result:', result);
              
              toast({
                title: 'Zahlung erfolgreich!',
                description: 'Ihre Zahlung wurde erfolgreich verarbeitet.',
              });
              
              setVerificationComplete(true);
            } catch (error) {
              console.error('=== PAYMENT VERIFICATION FAILED ===');
              console.error('Verification error details:', error);
              
              toast({
                title: 'Zahlungsverifikation fehlgeschlagen',
                description: 'Bitte kontaktieren Sie den Support wenn das Problem weiterhin besteht.',
                variant: 'destructive',
              });
              
              // Still set verification as complete to show error state
              setVerificationComplete(false);
            }
          }
          
        } catch (error: any) {
          console.error('=== PAYMENT CONFIRMATION ERROR ===');
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            full_error: error
          });
          
          toast({
            title: 'Fehler bei der Zahlungsbestätigung',
            description: error.message || 'Bitte kontaktieren Sie den Support.',
            variant: 'destructive',
          });
          
          setVerificationComplete(false);
        } finally {
          console.log('=== PAYMENT VERIFICATION COMPLETE ===');
          setIsVerifying(false);
        }
      } else {
        console.log('=== MISSING PAYMENT INTENT OR USER ===');
        console.log('Payment Intent present:', !!paymentIntent);
        console.log('User authenticated:', !!user);
        
        setIsVerifying(false);
        
        if (!user) {
          console.log('User not authenticated, redirecting to auth page');
          navigate('/auth');
        } else if (!paymentIntent) {
          console.log('No payment intent found, redirecting to order page');
          navigate('/order');
        } else {
          console.log('Unknown state, redirecting to order page');
          navigate('/order');
        }
      }
    };

    handlePaymentReturn();
  }, [searchParams, user, confirmPayment, navigate, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Zahlung wird verifiziert...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              Wir überprüfen Ihre Zahlungsdaten. Dies dauert nur einen Moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!verificationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Zahlungsproblem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-600">
              Es gab ein Problem mit Ihrer Zahlung. Sie werden zur Bestellseite weitergeleitet.
            </p>
            <Button onClick={() => navigate('/order')} className="w-full">
              Zurück zur Bestellung
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Zahlung erfolgreich!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Ihre Bestellung wurde erfolgreich verarbeitet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/orders')} className="w-full">
              Meine Bestellungen ansehen
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
              Zurück zum Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
