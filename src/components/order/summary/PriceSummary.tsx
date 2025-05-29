
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderData {
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  couponCode?: string;
}

interface PriceSummaryProps {
  orderData: OrderData;
}

const PriceSummary = ({ orderData }: PriceSummaryProps) => {
  const packagePrices = {
    basic: 9.00,
    premium: 13.00,
  };

  const extraPrices = {
    express: 2.00,
    upscale: 0,
    watermark: 1.00,
  };

  const basePrice = orderData.package ? packagePrices[orderData.package] : 0;
  const extrasCost = Object.entries(orderData.extras)
    .filter(([_, enabled]) => enabled)
    .reduce((sum, [extra, _]) => sum + extraPrices[extra as keyof typeof extraPrices], 0);
  
  const subtotal = (basePrice + extrasCost) * orderData.files.length;
  const discount = orderData.couponCode === 'WELCOME10' ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>💰</span>
          <span>Bestellübersicht</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Paket:</span>
            <span className="font-medium">
              {orderData.package === 'basic' ? 'Basic HDR' : 'Premium HDR & Retusche'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Bilder:</span>
            <span className="font-medium">{orderData.files.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Grundpreis Paket:</span>
            <span>€{packagePrices[orderData.package!]?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        {Object.entries(orderData.extras).some(([_, enabled]) => enabled) && (
          <div className="border-t pt-2">
            <h4 className="font-medium mb-2">Extras:</h4>
            {Object.entries(orderData.extras)
              .filter(([_, enabled]) => enabled)
              .map(([extra, _]) => (
                <div key={extra} className="flex justify-between text-sm">
                  <span>{extra === 'express' ? 'Express' : extra === 'upscale' ? 'Weichzeichnen' : 'Wasserzeichen'}:</span>
                  <span>+€{extraPrices[extra as keyof typeof extraPrices].toFixed(2)}</span>
                </div>
              ))}
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Zwischensumme:</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Rabatt:</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>Gesamtsumme:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSummary;
