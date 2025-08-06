
import React from 'react';
import SummaryStepHeader from './summary/SummaryStepHeader';
import SummaryStepContent from './summary/SummaryStepContent';
import SummaryStepActions from './summary/SummaryStepActions';
import PaymentModal from '@/components/payment/PaymentModal';
import { useSummaryStepLogic } from '@/hooks/useSummaryStepLogic';
import type { OrderData } from '@/utils/orderValidation';

interface SummaryStepProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SummaryStep = ({ orderData, onUpdateData, onNext, onPrev }: SummaryStepProps) => {
  const {
    paymentMethod,
    setPaymentMethod,
    creditsToUse,
    setCreditsToUse,
    showPaymentModal,
    setShowPaymentModal,
    canProceed,
    finalPrice,
    isProcessing,
    clientSecret,
    handleSubmitOrder,
    handlePaymentModalSuccess,
    handlePaymentModalError
  } = useSummaryStepLogic(orderData, onNext);

  return (
    <div className="space-y-3 md:space-y-4">
      <SummaryStepHeader />

      <SummaryStepContent
        orderData={orderData}
        onUpdateData={onUpdateData}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        creditsToUse={creditsToUse}
        onCreditsChange={setCreditsToUse}
      />

      <SummaryStepActions
        onPrev={onPrev}
        onSubmit={handleSubmitOrder}
        canProceed={canProceed}
        isProcessing={isProcessing}
        finalPrice={finalPrice}
        paymentMethod={paymentMethod}
      />

      {/* In-App Payment Modal */}
      {showPaymentModal && clientSecret && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentModalSuccess}
          onError={handlePaymentModalError}
          clientSecret={clientSecret}
          amount={finalPrice}
        />
      )}
    </div>
  );
};

export default SummaryStep;
