
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Download, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useOrders } from '@/hooks/useOrders';

interface OrderData {
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
}

interface ConfirmationStepProps {
  orderData: OrderData;
}

const ConfirmationStep = ({ orderData }: ConfirmationStepProps) => {
  const { packages, addOns } = useOrders();
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const estimatedDelivery = orderData.extras.express ? '24h' : '24–48h';

  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  
  // Calculate effective image count for bracketing
  let imageCount = orderData.files.length;
  if (orderData.photoType === 'bracketing-3') {
    imageCount = Math.floor(orderData.files.length / 3);
  } else if (orderData.photoType === 'bracketing-5') {
    imageCount = Math.floor(orderData.files.length / 5);
  }

  // Send confirmation email
  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (!orderData.email || !selectedPackage) return;

      const selectedExtras = addOns
        .filter(addon => orderData.extras[addon.name as keyof typeof orderData.extras])
        .map(addon => addon.description);

      const totalPrice = selectedPackage.base_price * imageCount + 
        addOns.reduce((total, addon) => {
          if (orderData.extras[addon.name as keyof typeof orderData.extras] && !addon.is_free) {
            return total + (addon.price * imageCount);
          }
          return total;
        }, 0);

      try {
        const { error } = await supabase.functions.invoke('send-order-confirmation', {
          body: {
            orderId,
            customerEmail: orderData.email,
            orderDetails: {
              packageName: selectedPackage.description,
              photoType: orderData.photoType || 'Standard',
              imageCount,
              totalPrice,
              extras: selectedExtras,
            },
          },
        });

        if (error) {
          console.error('Failed to send confirmation email:', error);
        }
      } catch (error) {
        console.error('Failed to send confirmation email:', error);
      }
    };

    sendConfirmationEmail();
  }, [orderData, selectedPackage, addOns, imageCount, orderId]);

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Danke für Ihre Bestellung!</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Wir haben Ihre Zahlung erhalten und starten sofort mit der Bearbeitung. Sie erhalten in Kürze eine E-Mail mit 
          Ihrer Rechnung (PDF) und einen Download-Link, sobald die bearbeiteten Bilder fertig sind.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <span>Bestellung {orderId}</span>
            <Badge className="bg-blue-100 text-blue-800">In Bearbeitung</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Bestelldetails</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket:</span>
                  <span>{selectedPackage?.description || orderData.package}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bilder:</span>
                  <span>{imageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">E-Mail:</span>
                  <span className="truncate">{orderData.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Nächste Schritte</h3>
              <div className="text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Bearbeitung: {estimatedDelivery}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Download-Link per E-Mail</span>
                </div>
              </div>
            </div>
          </div>

          {Object.values(orderData.extras).some(Boolean) && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Gewählte Extras</h3>
              <div className="flex flex-wrap gap-2">
                {orderData.extras.express && (
                  <Badge variant="outline">Express-Bearbeitung</Badge>
                )}
                {orderData.extras.upscale && (
                  <Badge variant="outline">AI Upscaling</Badge>
                )}
                {orderData.extras.watermark && (
                  <Badge variant="outline">Eigenes Wasserzeichen</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-green-50 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Users className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-900">Social Proof</span>
        </div>
        <p className="text-green-800 text-sm">
          Schon über 5.000 zufriedene Kunden – danke für Ihr Vertrauen!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="min-w-[200px]">
          <Link to="/dashboard">
            <ArrowRight className="w-4 h-4 mr-2" />
            Zum Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/order-flow">
            Weitere Bilder hochladen
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
