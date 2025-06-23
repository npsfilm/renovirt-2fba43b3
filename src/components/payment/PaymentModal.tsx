import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock } from 'lucide-react';
import StripeProvider from './StripeProvider';
import StripePaymentForm from './StripePaymentForm';
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  clientSecret: string;
  amount: number;
}
const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  clientSecret,
  amount
}: PaymentModalProps) => {
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-green-600" />
            <span>Sichere Zahlung</span>
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Alle Transaktionen sind sicher und verschlüsselt
          </p>
        </DialogHeader>
        <StripeProvider clientSecret={clientSecret}>
          <StripePaymentForm onSuccess={onSuccess} onError={onError} amount={amount} />
        </StripeProvider>
      </DialogContent>
    </Dialog>;
};
export default PaymentModal;