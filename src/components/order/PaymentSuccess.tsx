
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { verifyPayment, isVerifyingPayment } = usePayment();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [verified, setVerified] = React.useState(false);
  const [verificationComplete, setVerificationComplete] = React.useState(false);
  const [verificationError, setVerificationError] = React.useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId && !verified && !verificationComplete) {
      setVerificationComplete(true);
      verifyPayment({ sessionId })
        .then(() => {
          setVerified(true);
          // Invalidate queries to show the new order
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        })
        .catch((error) => {
          console.error('Payment verification failed:', error);
          setVerified(false);
          setVerificationError(true);
        });
    }
  }, [searchParams, verifyPayment, verified, verificationComplete, queryClient]);

  if (isVerifyingPayment || !verificationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Zahlung wird verifiziert...
              </p>
              <p className="text-sm text-gray-600">
                Wir überprüfen Ihre Zahlung und erstellen Ihre Bestellung. Dies dauert nur wenige Sekunden.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">
              Verifizierung fehlgeschlagen
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Die Zahlungsverifizierung konnte nicht abgeschlossen werden. Bitte kontaktieren Sie den Support.
            </p>
            <div className="space-y-2 pt-4">
              <Button 
                onClick={() => navigate('/orders')} 
                className="w-full"
              >
                Zu meinen Bestellungen
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
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Zahlung erfolgreich!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Ihre Zahlung wurde erfolgreich verarbeitet und Ihre Bestellung wurde erstellt. Die Bearbeitung Ihrer Bilder beginnt nun.
          </p>
          <p className="text-sm text-gray-500">
            Sie erhalten eine Benachrichtigung, sobald Ihre Bilder fertig bearbeitet sind.
          </p>
          <div className="space-y-2 pt-4">
            <Button 
              onClick={() => navigate('/orders')} 
              className="w-full"
            >
              Zu meinen Bestellungen
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
