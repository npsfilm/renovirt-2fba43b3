
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Euro, Image } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface OrderSummaryProps {
  order: ExtendedOrder | undefined;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Image className="w-4 h-4" />
          Bestellübersicht
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Paket</span>
            <span className="font-medium">{order?.packages?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Bilder</span>
            <span className="font-medium">{order?.image_count || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t">
          <span className="text-gray-500">Gesamtpreis</span>
          <div className="flex items-center gap-1">
            <Euro className="w-4 h-4 text-gray-500" />
            <span className="font-bold text-lg">
              {parseFloat(order?.total_price?.toString() || '0').toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t">
          <Calendar className="w-4 h-4" />
          <span>Erstellt am {new Date(order?.created_at || '').toLocaleDateString('de-DE')}</span>
        </div>

        {order?.payment_status && (
          <Badge variant="outline" className="w-fit">
            Zahlung: {order.payment_status}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
