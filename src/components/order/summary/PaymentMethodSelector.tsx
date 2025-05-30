
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, FileText } from 'lucide-react';

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
                    <span className="font-medium">Kreditkarte / PayPal</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Sichere Zahlung über Stripe
                  </p>
                  <div className="flex items-center space-x-3 mt-2">
                    {/* Real Stripe logo */}
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Cpath fill='%236772e5' d='M13.8 11.4c0-.6-.5-1-1.3-1-1.3 0-2.3.5-3.3 1.2v-1c.9-.6 2.2-1.2 3.4-1.2 1.6 0 2.6.8 2.6 2.1v.4l-3.3.5c-1.5.2-2.3.9-2.3 2 0 1.1.8 1.9 2.3 1.9 1 0 1.9-.4 2.6-1.1.1.7.5 1.1 1.2 1.1.3 0 .6-.1.8-.2v-.8c-.2.1-.4.1-.5.1s-.3-.1-.3-.4v-2.6zm-1.4 2.5c-.6.7-1.3 1-2.1 1-.8 0-1.2-.4-1.2-1s.3-.9 1.1-1l2.2-.3v1.3z'/%3E%3Cpath fill='%236772e5' d='M28 13.8c0 7.6-6.2 13.8-13.8 13.8S.4 21.4.4 13.8 6.6 0 14.2 0 28 6.2 28 13.8zm-15.1-4.4v8.1h-1.4v-8.1h1.4zm8.8 2.2v5.9h-1.3v-.9c-.6.7-1.4 1.1-2.4 1.1-1.8 0-3.2-1.5-3.2-3.1s1.4-3.1 3.2-3.1c1 0 1.8.4 2.4 1.1v-.9h1.3zm-1.3 3c0-1.1-.8-1.9-1.9-1.9s-1.9.8-1.9 1.9.8 1.9 1.9 1.9 1.9-.8 1.9-1.9z'/%3E%3C/svg%3E" 
                      alt="Stripe" 
                      className="h-4"
                    />
                    {/* Real Visa logo */}
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 26'%3E%3Cpath fill='%231a1f71' d='M15.9 6.5h-4.6l-2.9 13h4.6l2.9-13zm11.4 8.4c0-3.4-4.5-3.5-4.5-5 0-.5.4-.9 1.4-.9 1.6-.1 2.8.3 3.6.6l.6-3.1c-.9-.3-2.1-.6-3.5-.6-3.7 0-6.3 2-6.3 4.8 0 2.1 1.9 3.3 3.3 4 1.5.7 2 1.1 2 1.7 0 .9-1.1 1.3-2.1 1.3-1.8 0-2.8-.4-3.6-.8l-.6 3.1c.8.4 2.3.7 3.8.7 3.9 0 6.5-1.9 6.5-4.9 0-3.7-4.6-3.9-4.6-4.9zm9.8-8.4h-3.6c-1.1 0-1.9.3-2.4 1.4l-6.8 11.6h3.9l.8-2.2h4.8l.5 2.2h3.4l-3-13zm-4.9 8.2l2-5.4.7 5.4h-2.7zM8.7 6.5L4.3 16.4l-.5-2.4c-.8-2.7-3.3-5.6-6.1-7.1l4.1 12.6h3.9l5.9-13h-3.9z'/%3E%3Cpath fill='%23f79e1b' d='M1.6 6.5H.1v.7c4.7.5 7.9 3.3 9.2 6.3L7.6 7.8c-.3-1-.8-1.2-1.9-1.3H1.6z'/%3E%3C/svg%3E" 
                      alt="Visa" 
                      className="h-4"
                    />
                    {/* Real Mastercard logo */}
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 26'%3E%3Cpath fill='%23ff5f00' d='M15.2 24.4h9.6V1.6h-9.6z'/%3E%3Cpath fill='%23eb001b' d='M16.8 13c0-4.2 2-7.9 5-10.4C19.4 1 16.8 0 13.9 0 6.2 0 0 5.8 0 13s6.2 13 13.9 13c2.9 0 5.5-1 7.9-2.6-3-2.5-5-6.2-5-10.4z'/%3E%3Cpath fill='%230099df' d='M40 13c0 7.2-6.2 13-13.9 13-2.9 0-5.5-1-7.9-2.6 3-2.5 5-6.2 5-10.4s-2-7.9-5-10.4C20.6 1 23.2 0 26.1 0 33.8 0 40 5.8 40 13z'/%3E%3C/svg%3E" 
                      alt="Mastercard" 
                      className="h-4"
                    />
                    {/* Real PayPal logo */}
                    <img 
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 26'%3E%3Cpath fill='%23003087' d='M12.2 2.4c.6-3.9-1.7-5.9-6.4-5.9H.5C0 -3.5-.4-3.1-.6-2.4L-3.5 17.2c-.1.6.2 1.1.8 1.1h5.2l1.3-8.4-.04.3c.2-.7.7-1.1 1.3-1.1h2.7c5.3 0 9.5-2.2 10.7-8.4.1-.4.1-.7.1-1 0-.3-.04-.6-.1-.9-.1.1-.1.2-.2.4'/%3E%3Cpath fill='%23009cde' d='M14.8 2.1c-.1-.3-.2-.5-.4-.7-.2-.2-.5-.4-.8-.5-1.3-.5-3.1-.7-5.5-.7H4.6c-.7 0-1.3.5-1.5 1.2L.4 17.1c-.1.7.3 1.3 1 1.3h7.3l1.8-11.4c.1-.4.4-.7.8-.7h.5c1.5 0 2.7.1 3.5.4.2.1.4.2.5.3.2.2.3.4.4.7.1.5.1 1.1-.04 1.8-.5 3.1-2.1 5.6-4.7 7.1-.6.4-1.3.7-2 .9-.7.2-1.5.3-2.4.3h-.9c-.7 0-1.3.5-1.5 1.2L2.8 22c-.1.4.2.8.6.8h4.7c.6 0 1.1-.4 1.3-1l.04-.2 1.1-6.8.1-.2c.1-.6.6-1 1.3-1h.8c4.6 0 8.2-1.9 9.3-7.3.4-2.3.2-4.2-.9-5.5-.3-.4-.7-.7-1.1-.9'/%3E%3C/svg%3E" 
                      alt="PayPal" 
                      className="h-6"
                    />
                  </div>
                </div>
              </div>
            </Label>

            <Label htmlFor="invoice" className="cursor-pointer">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="invoice" id="invoice" />
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
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
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
