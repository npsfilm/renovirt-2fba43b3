
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Zap, Scale, Droplets, Tag, CreditCard, FileText } from 'lucide-react';

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
  acceptedTerms: boolean;
}

interface SummaryStepProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SummaryStep = ({ orderData, onUpdateData, onNext, onPrev }: SummaryStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'invoice'>('stripe');

  const packagePrices = {
    basic: 9.00,
    premium: 13.00,
  };

  const extraPrices = {
    express: 2.00,
    upscale: 0, // Free option
    watermark: 1.00,
  };

  const basePrice = orderData.package ? packagePrices[orderData.package] : 0;
  const extrasCost = Object.entries(orderData.extras)
    .filter(([_, enabled]) => enabled)
    .reduce((sum, [extra, _]) => sum + extrasPrices[extra as keyof typeof extraPrices], 0);
  
  const subtotal = (basePrice + extrasCost) * orderData.files.length;
  const discount = orderData.couponCode === 'WELCOME10' ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

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

  const canProceed = orderData.acceptedTerms && orderData.email;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Letzter Check: Ihre Bestellung</h1>
        <p className="text-gray-600">Bitte überprüfen Sie Ihre Auswahl. Mit Klick auf "Kostenpflichtig bestellen" wird die Bestellung verbindlich.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
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

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Zahlungsart wählen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="text-blue-600"
                    />
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Kreditkarte / PayPal (Stripe)</p>
                      <p className="text-sm text-gray-600">Sofortige Bearbeitung nach Zahlung</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    paymentMethod === 'invoice' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('invoice')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={paymentMethod === 'invoice'}
                      onChange={() => setPaymentMethod('invoice')}
                      className="text-blue-600"
                    />
                    <FileText className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Rechnung (wird nachträglich versandt)</p>
                      <p className="text-sm text-gray-600">Zahlungsziel 14 Tage</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={orderData.acceptedTerms}
                  onCheckedChange={(checked) => onUpdateData({ acceptedTerms: checked as boolean })}
                />
                <p className="text-sm text-gray-600">
                  Ich habe die <span className="text-blue-600 underline cursor-pointer">AGB</span> gelesen und akzeptiere die{' '}
                  <span className="text-blue-600 underline cursor-pointer">Datenschutzerklärung</span>. Mit Klick auf
                  "Kostenpflichtig bestellen" schließe ich einen verbindlichen Vertrag ab.
                </p>
              </div>
              {!orderData.acceptedTerms && (
                <p className="text-red-600 text-sm mt-2">Bitte akzeptieren Sie die Bedingungen, um fortzufahren.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Price Summary */}
        <div>
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
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          ← Zurück zum Paket
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="min-w-[200px] bg-green-600 hover:bg-green-700"
        >
          Kostenpflichtig bestellen →
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;
