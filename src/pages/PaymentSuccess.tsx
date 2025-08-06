import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
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
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      const paymentIntent = searchParams.get('payment_intent');
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
      const redirectStatus = searchParams.get('redirect_status');

      console.log('PaymentSuccess - URL params:', {
        paymentIntent,
        redirectStatus,
        hasClientSecret: !!paymentIntentClientSecret
      });

      if (!paymentIntent) {
        setVerificationError('Zahlungsintent-ID fehlt in der URL');
        setIsVerifying(false);
        return;
      }

      if (!user) {
        setVerificationError('Benutzer nicht angemeldet');
        setIsVerifying(false);
        return;
      }

      try {
        console.log('Verifiziere Zahlung:', paymentIntent);
        const result = await confirmPayment(paymentIntent);
        
        console.log('Zahlungsverifikation Ergebnis:', result);
        
        toast({
          title: 'Zahlung erfolgreich!',
          description: 'Ihre Bestellung wurde erfolgreich verarbeitet.'
        });
        
        setVerificationComplete(true);
      } catch (error: any) {
        console.error('Zahlungsverifikation fehlgeschlagen:', error);
        setVerificationError(error.message || 'Zahlungsverifikation fehlgeschlagen');
        
        toast({
          title: 'Verifikationsfehler',
          description: 'Es gab ein Problem bei der Zahlungsverifikation.',
          variant: 'destructive'
        });
      } finally {
        setIsVerifying(false);
      }
    };

    handlePaymentReturn();
  }, [searchParams, confirmPayment, user, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">Zahlung wird verifiziert</h2>
            <p className="text-gray-600">
              Bitte warten Sie, während wir Ihre Zahlung verarbeiten...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationError || !verificationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              Verifikationsfehler
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              {verificationError || 'Die Zahlungsverifikation ist unvollständig.'}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/order')}
                className="w-full"
              >
                Zurück zur Bestellung
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/orders')}
                className="w-full"
              >
                Meine Bestellungen anzeigen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="h-6 w-6 mr-2" />
            Zahlung erfolgreich!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Ihre Zahlung wurde erfolgreich verarbeitet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/orders')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Meine Bestellungen anzeigen
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/dashboard')}
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