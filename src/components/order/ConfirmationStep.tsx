
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Download, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import type { OrderData } from '@/utils/orderValidation';

interface ConfirmationStepProps {
  orderData: OrderData;
  orderId?: string;
  orderNumber?: string;
}

const ConfirmationStep = ({ orderData, orderNumber = 'RV-' + Date.now().toString().slice(-8) }: ConfirmationStepProps) => {
  const { packages, addOns } = useOrders();
  const estimatedDelivery = orderData.extras.express ? '24 Stunden' : '24–48 Stunden';

  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);

  return (
    <div className="space-y-6">
      {/* Header section with success icon */}
      <div className="text-center space-y-4 mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Vielen Dank für Ihre Bestellung!</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Wir haben Ihre Bestellung erhalten und starten sofort mit der Bearbeitung. 
          Sie erhalten eine Bestätigungs-E-Mail mit den Details Ihrer Bestellung.
        </p>
      </div>

      {/* Order progress steps */}
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between mb-8">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">1</div>
            <span className="text-sm mt-2 text-green-600 font-medium">Bestätigt</span>
          </div>
          <div className="flex-1 border-t-2 border-green-600 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">2</div>
            <span className="text-sm mt-2 text-gray-600">In Bearbeitung</span>
          </div>
          <div className="flex-1 border-t-2 border-gray-300 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">3</div>
            <span className="text-sm mt-2 text-gray-600">Qualitätsprüfung</span>
          </div>
          <div className="flex-1 border-t-2 border-gray-300 self-center"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">4</div>
            <span className="text-sm mt-2 text-gray-600">Fertiggestellt</span>
          </div>
        </div>
      </div>

      {/* Order summary card */}
      <Card className="max-w-3xl mx-auto border border-gray-200">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="flex items-center justify-between">
            <span>Bestellnummer: {orderNumber}</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              In Bearbeitung
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Main order details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Bestelldetails</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket:</span>
                  <span className="font-medium">{selectedPackage?.description || orderData.package}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Foto-Typ:</span>
                  <span className="font-medium">
                    {orderData.photoType === 'standard' ? 'Standard' : 
                     orderData.photoType === 'bracketing-3' ? 'Bracketing (3 Bilder)' :
                     orderData.photoType === 'bracketing-5' ? 'Bracketing (5 Bilder)' : 
                     orderData.photoType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bilder:</span>
                  <span className="font-medium">{imageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">E-Mail:</span>
                  <span className="font-medium">{orderData.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Zeitplan</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Voraussichtliche Fertigstellung</p>
                    <p className="text-gray-600 text-sm">in {estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Download-Link</p>
                    <p className="text-gray-600 text-sm">Sie erhalten den Link nach Fertigstellung per E-Mail</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extras section - only show if extras were selected */}
          {Object.values(orderData.extras).some(Boolean) && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Gewählte Extras</h3>
              <div className="flex flex-wrap gap-2">
                {orderData.extras.express && (
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                    Express Bearbeitung
                  </Badge>
                )}
                {orderData.extras.upscale && (
                  <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                    KI Upscaling
                  </Badge>
                )}
                {orderData.extras.watermark && (
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    Eigenes Wasserzeichen
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social proof and next steps */}
      <div className="bg-blue-50 rounded-lg p-6 max-w-3xl mx-auto">
        <p className="text-center text-blue-800 mb-2 font-medium">
          Wir halten Sie über alle Fortschritte Ihrer Bestellung auf dem Laufenden
        </p>
        <p className="text-center text-blue-700 text-sm">
          Über {Math.floor(Math.random() * 5000) + 5000} zufriedene Kunden vertrauen auf Renovirt für ihre Immobilienbilder
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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
