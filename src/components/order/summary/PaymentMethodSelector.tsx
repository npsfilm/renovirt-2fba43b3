
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentIcons, InvoiceIcon } from '@/components/payment/PaymentIcons';
import { CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'stripe' | 'invoice';
  onPaymentMethodChange: (method: 'stripe' | 'invoice') => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Zahlungsmethode wählen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
          <div className="space-y-4">
            <Label htmlFor="stripe" className="cursor-pointer">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="stripe" id="stripe" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-5 bg-primary rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">S</span>
                    </div>
                    <span className="font-medium">Kreditkarte / Online-Zahlung</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sichere Zahlung über Stripe
                  </p>
                  <div className="mt-3">
                    <PaymentIcons showSecurity={false} className="scale-90" />
                  </div>
                </div>
              </div>
            </Label>

            <Label htmlFor="invoice" className="cursor-pointer">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="invoice" id="invoice" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <InvoiceIcon className="w-5 h-5" />
                    <span className="font-medium">Rechnung</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sie erhalten eine Rechnung per E-Mail (Zahlungsziel: 14 Tage)
                  </p>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
