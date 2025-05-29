
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tag, Zap, Scale, Droplets } from 'lucide-react';

interface OrderData {
  files: File[];
  package?: 'basic' | 'premium';
  extras: {
    express: boolean;
    upscale: boolean;
    watermark: boolean;
  };
  email?: string;
  couponCode?: string;
}

interface OrderSummaryDetailsProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
}

const OrderSummaryDetails = ({ orderData, onUpdateData }: OrderSummaryDetailsProps) => {
  const packagePrices = {
    basic: 9.00,
    premium: 13.00,
  };

  const extras = [
    {
      key: 'express' as const,
      icon: Zap,
      title: 'Express-Bearbeitung (+2.00 € pro Bild)',
      description: 'Lieferung in 24h statt 48h. Macht Bilder klickstärker – ideal für hochwertige Listings!',
      price: 2.00,
    },
    {
      key: 'upscale' as const,
      icon: Scale,
      title: 'Weichzeichnen (optional)',
      description: 'Kostenfrei – Sie erhalten beide Versionen (Originalschärfe & Weichgezeichnet). Ideal für einen sanfteren Look.',
      price: 0,
    },
    {
      key: 'watermark' as const,
      icon: Droplets,
      title: 'Eigenes Wasserzeichen verwenden (+1.00 € pro Bild)',
      description: 'Branden Sie Ihre Bilder mit Ihrem eigenen Logo.',
      price: 1.00,
    },
  ];

  const handleExtraChange = (extraKey: keyof typeof orderData.extras, checked: boolean) => {
    onUpdateData({
      extras: {
        ...orderData.extras,
        [extraKey]: checked,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bestellübersicht</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span>E-Mail Adresse (für Auftragsbestätigung & Lieferung):</span>
        </div>
        <Input
          type="email"
          placeholder="kunde@example.com"
          value={orderData.email || ''}
          onChange={(e) => onUpdateData({ email: e.target.value })}
        />

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Gewähltes Paket:</h4>
          <p className="text-gray-600">
            {orderData.package === 'basic' ? 'Basic HDR' : 'Premium HDR & Retusche'} - €{packagePrices[orderData.package!].toFixed(2)} pro Bild
          </p>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Optionen:</h4>
          <div className="space-y-3">
            {extras.map((extra) => (
              <div key={extra.key} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={orderData.extras[extra.key]}
                    onCheckedChange={(checked) => handleExtraChange(extra.key, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <extra.icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">{extra.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{extra.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Bilder ({orderData.files.length}):</h4>
          <div className="grid grid-cols-4 gap-2">
            {orderData.files.slice(0, 4).map((file, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                <span className="text-xs text-gray-500">{file.name.substring(0, 8)}...</span>
              </div>
            ))}
            {orderData.files.length > 4 && (
              <div className="aspect-square bg-gray-100 rounded border flex items-center justify-center">
                <span className="text-xs text-gray-500">+{orderData.files.length - 4} mehr</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <Label>Haben Sie einen Gutschein?</Label>
          </div>
          <Input
            placeholder="Gutscheincode eingeben"
            value={orderData.couponCode || ''}
            onChange={(e) => onUpdateData({ couponCode: e.target.value })}
            className="mt-2"
          />
          {orderData.couponCode === 'WELCOME10' && (
            <p className="text-green-600 text-sm mt-1">10% Rabatt angewendet!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryDetails;
