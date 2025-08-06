
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
      // PayPal und andere Redirect-Methoden kommen hier an
      const paymentIntent = searchParams.get('payment_intent');
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
      const redirectStatus = searchParams.get('redirect_status');

      console.log('Payment return parameters:', {
        paymentIntent,
        paymentIntentClientSecret,
        redirectStatus
      });

      if (paymentIntent && user) {
        try {
          setIsVerifying(true);
          
          // Für PayPal-Zahlungen, die über Redirect zurückkommen
          if (redirectStatus === 'succeeded') {
            console.log('PayPal payment succeeded, verifying...');
            await confirmPayment(paymentIntent);
            
            toast({
              title: 'Zahlung erfolgreich!',
              description: 'Ihre PayPal-Zahlung wurde erfolgreich verarbeitet.',
            });
            
            setVerificationComplete(true);
          } else if (redirectStatus === 'failed') {
            console.log('PayPal payment failed');
            toast({
              title: 'Zahlung fehlgeschlagen',
              description: 'Ihre PayPal-Zahlung konnte nicht verarbeitet werden.',
              variant: 'destructive',
            });
            
            // Zurück zur Bestellseite nach Fehlschlag
            setTimeout(() => {
              navigate('/order');
            }, 3000);
          } else {
            // Status unbekannt, versuchen wir trotzdem zu verifizieren
            console.log('Unknown redirect status, attempting verification...');
            try {
              await confirmPayment(paymentIntent);
              setVerificationComplete(true);
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast({
                title: 'Zahlungsverifikation fehlgeschlagen',
                description: 'Bitte kontaktieren Sie den Support.',
                variant: 'destructive',
              });
            }
          }
          
        } catch (error: any) {
          console.error('Payment confirmation error:', error);
          toast({
            title: 'Fehler bei der Zahlungsbestätigung',
            description: error.message || 'Bitte kontaktieren Sie den Support.',
            variant: 'destructive',
          });
        } finally {
          setIsVerifying(false);
        }
      } else {
        // Keine Payment Intent gefunden oder User nicht angemeldet
        setIsVerifying(false);
        if (!user) {
          navigate('/auth');
        } else {
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
