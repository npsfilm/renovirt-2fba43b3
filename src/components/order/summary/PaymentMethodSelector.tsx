
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentIcons, InvoiceIcon } from '@/components/payment/PaymentIcons';
import { CreditCard, Shield, Clock } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'stripe' | 'invoice';
  onPaymentMethodChange: (method: 'stripe' | 'invoice') => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
          <CreditCard className="w-5 h-5" />
          Zahlungsmethode wählen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
          {/* Stripe Payment Option */}
          <Label htmlFor="stripe" className="cursor-pointer">
            <div className={`relative flex items-center p-4 border-2 rounded-lg transition-all hover:border-primary/50 ${
              paymentMethod === 'stripe' 
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}>
              <RadioGroupItem value="stripe" id="stripe" className="mr-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-white">S</span>
                      </div>
                      <span className="font-medium text-gray-900">Kreditkarte</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <Shield className="w-3 h-3" />
                      <span className="text-xs font-medium">Sicher</span>
                    </div>
                  </div>
                  {paymentMethod === 'stripe' && (
                    <div className="text-xs text-primary font-medium">Ausgewählt</div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Zahlen Sie sofort und sicher mit Ihrer Kreditkarte oder PayPal
                </p>
                <div className="flex justify-between items-center">
                  <PaymentIcons showSecurity={false} className="scale-75" />
                  <div className="text-xs text-gray-500">Powered by Stripe</div>
                </div>
              </div>
            </div>
          </Label>

          {/* Invoice Payment Option */}
          <Label htmlFor="invoice" className="cursor-pointer">
            <div className={`relative flex items-center p-4 border-2 rounded-lg transition-all hover:border-primary/50 ${
              paymentMethod === 'invoice' 
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}>
              <RadioGroupItem value="invoice" id="invoice" className="mr-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <InvoiceIcon className="w-5 h-5 text-gray-700" />
                      <span className="font-medium text-gray-900">Rechnung</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-medium">14 Tage</span>
                    </div>
                  </div>
                  {paymentMethod === 'invoice' && (
                    <div className="text-xs text-primary font-medium">Ausgewählt</div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Erhalten Sie eine Rechnung per E-Mail mit 14 Tagen Zahlungsziel
                </p>
              </div>
            </div>
          </Label>
        </RadioGroup>
        
        {/* Security Notice */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-700">
            Ihre Zahlungsdaten sind durch SSL-Verschlüsselung geschützt
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
