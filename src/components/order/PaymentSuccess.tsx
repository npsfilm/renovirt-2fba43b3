
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePayment } from '@/hooks/usePayment';
import { useAuth } from '@/hooks/useAuth';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmPayment } = usePayment();
  const { user } = useAuth();

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const sessionId = searchParams.get('session_id');

    if (orderId && sessionId && user) {
      // Use confirmPayment to verify the payment was successful
      confirmPayment(sessionId).catch(console.error);
    }
  }, [searchParams, user, confirmPayment]);

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
