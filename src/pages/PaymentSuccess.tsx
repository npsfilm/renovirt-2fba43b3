import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orderCreated] = useState(true); // Invoice orders are always created immediately

  useEffect(() => {
    // Show success toast for invoice orders
    toast({
      title: 'Bestellung erfolgreich erstellt!',
      description: 'Sie erhalten in Kürze eine Bestätigungs-E-Mail mit der Rechnung.',
    });
  }, [toast]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-xl text-green-600">Bestellung erfolgreich erstellt!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Ihre Bestellung wurde erfolgreich erstellt. Sie erhalten in Kürze eine Bestätigungs-E-Mail mit der Rechnung.
          </p>
          <div className="space-y-2">
            <Button onClick={handleGoToOrders} className="w-full">
              Meine Bestellungen ansehen
            </Button>
            <Button 
              onClick={handleGoToDashboard} 
              variant="outline" 
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