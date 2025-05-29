
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, FileText } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethod: 'stripe' | 'invoice';
  onPaymentMethodChange: (method: 'stripe' | 'invoice') => void;
}

const PaymentMethodSelector = ({ paymentMethod, onPaymentMethodChange }: PaymentMethodSelectorProps) => {
  return (
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
            onClick={() => onPaymentMethodChange('stripe')}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                checked={paymentMethod === 'stripe'}
                onChange={() => onPaymentMethodChange('stripe')}
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
            onClick={() => onPaymentMethodChange('invoice')}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                checked={paymentMethod === 'invoice'}
                onChange={() => onPaymentMethodChange('invoice')}
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
  );
};

export default PaymentMethodSelector;
