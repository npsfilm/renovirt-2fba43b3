
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';
import CreditsApplication from './CreditsApplication';
import type { OrderData } from '@/utils/orderValidation';

interface PriceSummaryProps {
  orderData: OrderData;
  creditsToUse?: number;
  onCreditsChange?: (credits: number) => void;
}

const PriceSummary = ({ orderData, creditsToUse = 0, onCreditsChange }: PriceSummaryProps) => {
  const { calculateTotalPrice } = useOrders();
  const basePrice = calculateTotalPrice(orderData);
  const creditDiscount = creditsToUse * 1; // 1 Euro per credit
  const finalPrice = Math.max(0, basePrice - creditDiscount);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Preisübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Basispreis</span>
            <span>{basePrice.toFixed(2)} €</span>
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
          
          <div className="text-xs text-gray-600">
            Alle Preise inkl. 19% MwSt.
          </div>
        </CardContent>
      </Card>

      {onCreditsChange && (
        <CreditsApplication
          totalPrice={basePrice}
          creditsToUse={creditsToUse}
          onCreditsChange={onCreditsChange}
          imageCount={orderData.imageCount}
        />
      )}
    </div>
  );
};

export default PriceSummary;
