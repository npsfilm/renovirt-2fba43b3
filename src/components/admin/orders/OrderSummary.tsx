
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Calendar, Euro, Hash } from 'lucide-react';
import type { ExtendedOrder } from '@/types/database';

interface OrderSummaryProps {
  order: ExtendedOrder | undefined;
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="w-4 h-4" />
          Bestellübersicht
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600">Nummer:</span>
            </div>
            <span className="font-mono text-xs">
              {order?.order_number || order?.id.slice(0, 8)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600">Datum:</span>
            </div>
            <span className="text-xs">
              {order?.created_at ? new Date(order.created_at).toLocaleDateString('de-DE') : 'Unbekannt'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600">Paket:</span>
            </div>
            <span className="text-xs">
              {order?.packages?.name || 'Standard'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Bilder:</span>
            <span className="text-xs">
              {order?.image_count || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between border-t pt-2">
            <div className="flex items-center gap-2">
              <Euro className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600 font-medium">Gesamt:</span>
            </div>
            <span className="font-bold text-sm">
              €{parseFloat(order?.total_price?.toString() || '0').toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
