
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';

interface OrderData {
  photoType?: 'handy' | 'kamera' | 'bracketing-3' | 'bracketing-5';
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  couponCode?: string;
  acceptedTerms: boolean;
}

interface PriceSummaryProps {
  orderData: OrderData;
}

const PriceSummary = ({ orderData }: PriceSummaryProps) => {
  const { packages, addOns, calculateTotalPrice } = useOrders();

  const selectedPackage = packages.find(pkg => pkg.name === orderData.package);
  
  // Calculate effective image count for bracketing
  let imageCount = orderData.files.length;
  if (orderData.photoType === 'bracketing-3') {
    imageCount = Math.floor(orderData.files.length / 3);
  } else if (orderData.photoType === 'bracketing-5') {
    imageCount = Math.floor(orderData.files.length / 5);
  }

  const basePrice = selectedPackage ? selectedPackage.base_price * imageCount : 0;
  const totalPrice = calculateTotalPrice(orderData);

  // Calculate extras cost
  const extrasTotal = addOns.reduce((total, addon) => {
    if (orderData.extras[addon.name as keyof typeof orderData.extras] && !addon.is_free) {
      return total + (addon.price * imageCount);
    }
    return total;
  }, 0);

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Preisübersicht</span>
          <Badge variant="outline">{imageCount} Bild{imageCount !== 1 ? 'er' : ''}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPackage && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{selectedPackage.description}</span>
              <span>€{basePrice.toFixed(2)}</span>
            </div>
            
            {orderData.photoType?.startsWith('bracketing') && (
              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                {orderData.files.length} Bilder → {imageCount} HDR-Gruppen
              </div>
            )}

            {/* Show individual extras */}
            {addOns.map(addon => {
              const isSelected = orderData.extras[addon.name as keyof typeof orderData.extras];
              if (!isSelected) return null;
              
              const addonCost = addon.is_free ? 0 : addon.price * imageCount;
              
              return (
                <div key={addon.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {addon.description}
                    {addon.is_free && <Badge className="ml-2" variant="secondary">Kostenlos</Badge>}
                  </span>
                  <span>€{addonCost.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Gesamt</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">inkl. MwSt.</p>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Sichere Zahlung über Stripe</p>
          <p>• Download-Link nach Fertigstellung</p>
          <p>• DSGVO-konforme Verarbeitung</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSummary;
