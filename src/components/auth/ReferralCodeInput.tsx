
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReferralValidation } from './referral/useReferralValidation';
import ValidationIcon from './referral/ValidationIcon';
import ValidationMessage from './referral/ValidationMessage';

interface ReferralCodeInputProps {
  onReferralCodeChange: (code: string, isValid: boolean) => void;
}

const ReferralCodeInput = ({ onReferralCodeChange }: ReferralCodeInputProps) => {
  const {
    referralCode,
    isValidating,
    validationState,
    errorMessage,
    retryCount,
    handleInputChange,
    handleRetry
  } = useReferralValidation(onReferralCodeChange);

  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode" className="text-sm text-muted-foreground">
        Empfehlungscode (optional)
      </Label>
      <div className="relative">
        <Input
          id="referralCode"
          type="text"
          placeholder="z.B. ABC12345"
          value={referralCode}
          onChange={handleInputChange}
          maxLength={12}
          className={`bg-input border-border text-foreground placeholder-muted-foreground h-12 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
            validationState === 'valid' 
              ? 'border-green-500' 
              : validationState === 'invalid' 
              ? 'border-red-500' 
              : validationState === 'error'
              ? 'border-yellow-500'
              : ''
          }`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <ValidationIcon 
            isValidating={isValidating} 
            validationState={validationState} 
          />
        </div>
      </div>
      
      <ValidationMessage 
        validationState={validationState}
        errorMessage={errorMessage}
        retryCount={retryCount}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default ReferralCodeInput;
