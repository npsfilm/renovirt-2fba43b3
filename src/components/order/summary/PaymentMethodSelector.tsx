
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { PaymentIcons, InvoiceIcon } from '@/components/payment/PaymentIcons';

interface PaymentMethodSelectorProps {
  paymentMethod: 'stripe' | 'invoice';
  onPaymentMethodChange: (method: 'stripe' | 'invoice') => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zahlungsmethode wählen</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
          <div className="space-y-4">
            <Label htmlFor="stripe" className="cursor-pointer">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="stripe" id="stripe" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Kreditkarte / Online-Zahlung</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Sichere Zahlung über Stripe
                  </p>
                  <div className="mt-3">
                    <PaymentIcons showSecurity={false} className="scale-90" />
                  </div>
                </div>
              </div>
            </Label>

            <Label htmlFor="invoice" className="cursor-pointer">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="invoice" id="invoice" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <InvoiceIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Rechnung</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Sie erhalten eine Rechnung per E-Mail (Zahlungsziel: 14 Tage)
                  </p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        <div className="mt-4 pt-4 border-t">
          <PaymentIcons />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
