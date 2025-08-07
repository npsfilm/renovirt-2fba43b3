import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceIcon } from '@/components/payment/PaymentIcons';
import { CreditCard, Shield, Clock } from 'lucide-react';
interface PaymentMethodSelectorProps {
  paymentMethod: 'invoice';
  onPaymentMethodChange: (method: 'invoice') => void;
}
const PaymentMethodSelector = ({
  paymentMethod,
  onPaymentMethodChange
}: PaymentMethodSelectorProps) => {
  return <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
            <CreditCard className="w-5 h-5" />
            Zahlungsmethode
          </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 md:space-y-3">
        <div className="space-y-3">
          {/* Invoice Payment Option - now the only option */}
          <div className="border-2 border-primary bg-primary/5 ring-2 ring-primary/20 p-4 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <InvoiceIcon className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-900">Rechnung</span>
                  </div>
                </div>
                <div className="text-xs text-primary font-medium">Standard-Zahlungsmethode</div>
              </div>
              <p className="text-sm text-gray-600">Sie erhalten eine Rechnung per E-Mail nach Abschluss der Bearbeitung</p>
            </div>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-700">
            Ihre Zahlungsdaten sind durch SSL-Verschlüsselung geschützt
          </span>
        </div>
      </CardContent>
    </Card>;
};
export default PaymentMethodSelector;