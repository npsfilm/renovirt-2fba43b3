
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { ExtendedOrder } from '@/types/database';

interface OrderInfoProps {
  order: ExtendedOrder | undefined;
}

const OrderInfo = ({ order }: OrderInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bestellinformationen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Kunde</Label>
          <p className="text-sm">
            {order?.customer_profiles?.first_name} {order?.customer_profiles?.last_name}
          </p>
          {order?.customer_profiles?.company && (
            <p className="text-xs text-gray-500">{order.customer_profiles.company}</p>
          )}
        </div>
        
        <div>
          <Label className="text-sm font-medium">E-Mail</Label>
          <p className="text-sm">{order?.customer_email}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Paket</Label>
          <p className="text-sm">{order?.packages?.name || 'N/A'}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Bilder</Label>
          <p className="text-sm">{order?.image_count || 0}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Gesamtpreis</Label>
          <p className="text-sm font-bold">€{parseFloat(order?.total_price?.toString() || '0').toFixed(2)}</p>
        </div>

        <div>
          <Label className="text-sm font-medium">Erstellt am</Label>
          <p className="text-sm">{new Date(order?.created_at || '').toLocaleDateString('de-DE')}</p>
        </div>

        {order?.admin_notes && (
          <div>
            <Label className="text-sm font-medium">Admin-Notizen</Label>
            <p className="text-sm text-gray-600">{order.admin_notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderInfo;
