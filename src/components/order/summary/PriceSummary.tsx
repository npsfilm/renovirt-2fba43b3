
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

const PriceSummary = ({ orderData, creditsToUse = 0, onCreditsChange }: PriceSummaryProps) => {
  const { calculateTotalPrice } = useOrders();
  const grossPrice = calculateTotalPrice(orderData);
  const netPrice = grossPrice / 1.19; // Calculate net price from gross
  const vatAmount = grossPrice - netPrice;
  const creditDiscount = creditsToUse * 1; // 1 Euro per credit
  const finalPrice = Math.max(0, grossPrice - creditDiscount);
  
  // Calculate effective image count
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Preisübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Netto</span>
            <span>{netPrice.toFixed(2)} €</span>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>MwSt. (19%)</span>
            <span>{vatAmount.toFixed(2)} €</span>
          </div>
          
          <div className="flex justify-between border-t pt-2">
            <span>Brutto</span>
            <span>{grossPrice.toFixed(2)} €</span>
          </div>
          
          {creditsToUse > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Credits-Rabatt ({creditsToUse} Credits)</span>
              <span>-{creditDiscount.toFixed(2)} €</span>
            </div>
          )}
          
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Gesamtpreis</span>
              <span>{finalPrice.toFixed(2)} €</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Preise zzgl. 19% MwSt.
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
