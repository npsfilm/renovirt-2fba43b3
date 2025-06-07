
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import { useUserCredits } from '@/hooks/useUserCredits';
import { calculateEffectiveImageCount } from '@/utils/orderValidation';
import CreditsApplication from './CreditsApplication';
import type { OrderData } from '@/utils/orderValidation';

interface PriceSummaryProps {
  orderData: OrderData;
  creditsToUse: number;
  onCreditsChange: (credits: number) => void;
}

const PriceSummary = ({ orderData, creditsToUse, onCreditsChange }: PriceSummaryProps) => {
  const { calculateTotalPrice } = useOrders();
  const { credits, isLoading: creditsLoading } = useUserCredits();

  const grossPrice = calculateTotalPrice(orderData);
  const creditsDiscount = Math.min(creditsToUse, grossPrice);
  const finalPrice = Math.max(0, grossPrice - creditsDiscount);
  const imageCount = calculateEffectiveImageCount(orderData.files, orderData.photoType);

  // Get proper package display name
  const getPackageDisplayName = (packageName?: string) => {
    switch (packageName) {
      case 'basic':
        return 'Basic HDR';
      case 'premium':
        return 'Premium HDR & Retusche';
      default:
        return packageName || '';
    }
  };

  const getPackagePrice = (packageName?: string) => {
    return packageName === 'basic' ? 9 : 13;
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Bestellübersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package */}
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{getPackageDisplayName(orderData.package)}</p>
            <p className="text-sm text-muted-foreground">
              {imageCount} {imageCount === 1 ? 'Bild' : 'Bilder'} × {getPackagePrice(orderData.package)}€
            </p>
          </div>
          <span className="font-medium">
            {(getPackagePrice(orderData.package) * imageCount).toFixed(2)}€
          </span>
        </div>

        {/* Extras */}
        {Object.entries(orderData.extras).some(([_, selected]) => selected) && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="font-medium text-sm">Extras</p>
              {orderData.extras.express && (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span>Express Bearbeitung</span>
                    <Badge variant="outline" className="text-xs">24h</Badge>
                  </div>
                  <span>{(2 * imageCount).toFixed(2)}€</span>
                </div>
              )}
              {orderData.extras.upscale && (
                <div className="flex justify-between items-center text-sm">
                  <span>KI Upscaling</span>
                  <span>{(2 * imageCount).toFixed(2)}€</span>
                </div>
              )}
              {orderData.extras.watermark && (
                <div className="flex justify-between items-center text-sm">
                  <span>Eigenes Wasserzeichen</span>
                  <span>{(2 * imageCount).toFixed(2)}€</span>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="font-medium">Zwischensumme</span>
          <span className="font-medium">{grossPrice.toFixed(2)}€</span>
        </div>

        {/* Credits */}
        {!creditsLoading && credits && credits > 0 && (
          <CreditsApplication
            availableCredits={credits}
            maxUsableCredits={grossPrice}
            creditsToUse={creditsToUse}
            onCreditsChange={onCreditsChange}
          />
        )}

        {creditsDiscount > 0 && (
          <div className="flex justify-between items-center text-success">
            <span>Guthaben angewendet</span>
            <span>-{creditsDiscount.toFixed(2)}€</span>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Gesamtpreis</span>
          <span>{finalPrice.toFixed(2)}€</span>
        </div>

        {finalPrice === 0 && (
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <p className="text-success font-medium">Kostenlos mit Ihrem Guthaben!</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Alle Preise inkl. 19% MwSt.
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceSummary;
