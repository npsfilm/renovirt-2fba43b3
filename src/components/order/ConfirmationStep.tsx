
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Download, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import { generateOrderNumber } from '@/utils/orderNumberGenerator';
import type { OrderData } from '@/utils/orderValidation';

interface ConfirmationStepProps {
  orderData: OrderData;
  orderId?: string;
  orderNumber?: string;
}

const ConfirmationStep = ({
  orderData,
  orderNumber = generateOrderNumber()
}: ConfirmationStepProps) => {
  const {
    packages,
    addOns
  } = useOrders();
  
  // Calculate delivery date and time considering weekends
  const orderDate = new Date();
  const deliveryDate = new Date(orderDate);
  
  if (orderData.extras.express) {
    // Express: 24 hours
    deliveryDate.setHours(deliveryDate.getHours() + 24);
  } else {
    // Standard: 48 hours
    deliveryDate.setHours(deliveryDate.getHours() + 48);
  }
  
  // Skip weekends - if delivery falls on Saturday (6) or Sunday (0), move to Monday
  while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    }).format(date);
  };
  
  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  
  return <div className="space-y-6">
      {/* Header section with success icon */}
      <div className="text-center space-y-4 mb-6">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Vielen Dank für Ihre Bestellung!</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Wir haben Ihre Bestellung erhalten und starten sofort mit der Bearbeitung. 
          Sie erhalten eine Bestätigungs-E-Mail mit den Details Ihrer Bestellung.
        </p>
      </div>

      {/* Order progress steps */}
      <div className="max-w-3xl mx-auto">
        
      </div>

      {/* Order summary card */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="flex items-center justify-between">
            <span>Bestellnummer: {orderNumber}</span>
            
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Main order details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Bestelldetails</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paket:</span>
                  <span className="font-medium">{selectedPackage?.description || orderData.package}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Foto-Typ:</span>
                  <span className="font-medium">
                    {orderData.photoType === 'handy' ? 'Smartphone' : orderData.photoType === 'kamera' ? 'Kamera' : orderData.photoType === 'bracketing-3' ? 'Bracketing (3 Bilder)' : orderData.photoType === 'bracketing-5' ? 'Bracketing (5 Bilder)' : orderData.photoType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bilder:</span>
                  <span className="font-medium">{imageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-Mail:</span>
                  <span className="font-medium">{orderData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bestellzeit:</span>
                  <span className="font-medium">{formatDateTime(orderDate)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">Zeitplan</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-info mt-0.5" />
                  <div>
                    <p className="font-medium">Voraussichtliche Fertigstellung</p>
                    <p className="text-muted-foreground text-sm">{formatDateTime(deliveryDate)}</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Extras section - only show if extras were selected */}
          {Object.values(orderData.extras).some(Boolean) && <div className="border-t pt-4">
              <h3 className="font-medium text-foreground mb-2">Gewählte Extras</h3>
              <div className="flex flex-wrap gap-2">
                {orderData.extras.express && <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                    Express Bearbeitung
                  </Badge>}
                {orderData.extras.upscale && <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                    KI Upscaling
                  </Badge>}
                {orderData.extras.watermark && <Badge variant="outline" className="border-info/30 bg-info/10 text-info">
                    Eigenes Wasserzeichen
                  </Badge>}
              </div>
            </div>}
        </CardContent>
      </Card>

      {/* Social proof and next steps */}
      <div className="bg-info/5 border border-info/20 rounded-lg p-6 max-w-3xl mx-auto">
        <p className="text-center text-info mb-2 font-medium">
          Wir halten Sie über alle Fortschritte Ihrer Bestellung auf dem Laufenden
        </p>
        <p className="text-center text-info/80 text-sm">
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
          <Link to="/order">
            Weitere Bilder hochladen
          </Link>
        </Button>
      </div>
    </div>;
};

export default ConfirmationStep;
