
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sichere Zahlung</DialogTitle>
        </DialogHeader>
        <StripeProvider clientSecret={clientSecret}>
          <StripePaymentForm
            onSuccess={onSuccess}
            onError={onError}
            amount={amount}
          />
        </StripeProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
