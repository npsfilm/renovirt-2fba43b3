
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePayment } from '@/hooks/usePayment';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { verifyPayment, isVerifyingPayment } = usePayment();
  const navigate = useNavigate();
  const [verified, setVerified] = React.useState(false);
  const [verificationComplete, setVerificationComplete] = React.useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId && !verified && !verificationComplete) {
      setVerificationComplete(true);
      verifyPayment({ sessionId })
        .then(() => {
          setVerified(true);
        })
        .catch((error) => {
          console.error('Payment verification failed:', error);
          setVerified(false);
        });
    }
  }, [searchParams, verifyPayment, verified, verificationComplete]);

  if (isVerifyingPayment || !verificationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-center text-gray-600">
              Zahlung wird verifiziert...
            </p>
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
            Ihre Zahlung wurde erfolgreich verarbeitet. Die Bearbeitung Ihrer Bilder beginnt nun.
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
