
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';
import CreditsApplication from './CreditsApplication';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import type { OrderData } from '@/utils/orderValidation';

interface PriceSummaryProps {
  orderData: OrderData;
  creditsToUse?: number;
  onCreditsChange?: (credits: number) => void;
}

// Net prices per image (these result in the displayed gross prices with 19% VAT)
const PACKAGE_NET_PRICES = {
  Basic: 7.56,    // Results in 9.00 € gross
  Premium: 10.92, // Results in 13.00 € gross
};

const EXTRAS_NET_PRICES = {
  express: 1.68,  // Results in 2.00 € gross
  upscale: 1.68,  // Results in 2.00 € gross
  watermark: 1.68, // Results in 2.00 € gross
};

const PriceSummary = ({ orderData, creditsToUse = 0, onCreditsChange }: PriceSummaryProps) => {
  const { calculateTotalPrice } = useOrders();
  const grossPrice = calculateTotalPrice(orderData);
  const creditDiscount = creditsToUse * 1; // 1 Euro per credit
  const finalPrice = Math.max(0, grossPrice - creditDiscount);
  
  // Calculate effective image count
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);
  
  // Get net price per image for the selected package
  const packageNetPrice = PACKAGE_NET_PRICES[orderData.package as keyof typeof PACKAGE_NET_PRICES];
  const baseNetPrice = packageNetPrice * imageCount;
  
  // Calculate extras net prices
  const extrasNetPrices = {
    express: orderData.extras.express ? EXTRAS_NET_PRICES.express * imageCount : 0,
    upscale: orderData.extras.upscale ? EXTRAS_NET_PRICES.upscale * imageCount : 0,
    watermark: orderData.extras.watermark ? EXTRAS_NET_PRICES.watermark * imageCount : 0,
  };
  
  const totalExtrasNet = Object.values(extrasNetPrices).reduce((sum, price) => sum + price, 0);
  const totalNetPrice = baseNetPrice + totalExtrasNet;
  const vatAmount = totalNetPrice * 0.19;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Preisübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Base Package */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{orderData.package} Paket ({imageCount} Bilder)</span>
              <span>{baseNetPrice.toFixed(2)} €</span>
            </div>
            <div className="text-xs text-muted-foreground pl-2">
              {packageNetPrice.toFixed(2)} € pro Bild (netto)
            </div>
          </div>
          
          {/* Extras Section */}
          {totalExtrasNet > 0 && (
            <div className="space-y-2 border-t pt-2">
              <div className="text-sm font-medium text-muted-foreground">Extras:</div>
              
              {orderData.extras.express && (
                <div className="flex justify-between text-sm pl-2">
                  <span>24h Express-Lieferung</span>
                  <span>{extrasNetPrices.express.toFixed(2)} €</span>
                </div>
              )}
              
              {orderData.extras.upscale && (
                <div className="flex justify-between text-sm pl-2">
                  <span>4K Upscale</span>
                  <span>{extrasNetPrices.upscale.toFixed(2)} €</span>
                </div>
              )}
              
              {orderData.extras.watermark && (
                <div className="flex justify-between text-sm pl-2">
                  <span>Eigenes Wasserzeichen</span>
                  <span>{extrasNetPrices.watermark.toFixed(2)} €</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>Extras gesamt</span>
                <span>{totalExtrasNet.toFixed(2)} €</span>
              </div>
            </div>
          )}
          
          {/* Net Total */}
          <div className="flex justify-between border-t pt-2">
            <span>Netto gesamt</span>
            <span>{totalNetPrice.toFixed(2)} €</span>
          </div>
          
          {/* VAT */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>MwSt. (19%)</span>
            <span>{vatAmount.toFixed(2)} €</span>
          </div>
          
          {/* Gross Total */}
          <div className="flex justify-between border-t pt-2">
            <span>Brutto gesamt</span>
            <span>{grossPrice.toFixed(2)} €</span>
          </div>
          
          {/* Credits Discount */}
          {creditsToUse > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Credits-Rabatt ({creditsToUse} Credits)</span>
              <span>-{creditDiscount.toFixed(2)} €</span>
            </div>
          )}
          
          {/* Final Price */}
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Gesamtpreis</span>
              <span>{finalPrice.toFixed(2)} €</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Alle Preise inklusive 19% MwSt.
          </div>
        </CardContent>
      </Card>

      {onCreditsChange && (
        <CreditsApplication
          totalPrice={grossPrice}
          creditsToUse={creditsToUse}
          onCreditsChange={onCreditsChange}
          imageCount={imageCount}
        />
      )}
    </div>
  );
};

export default PriceSummary;
