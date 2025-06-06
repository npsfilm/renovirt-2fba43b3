
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { validateReferralCode } from '@/utils/enhancedSecurityValidation';
import { secureLog } from '@/utils/secureLogging';

interface ReferralCodeInputProps {
  onReferralCodeChange: (code: string, isValid: boolean) => void;
}

const ReferralCodeInput = ({ onReferralCodeChange }: ReferralCodeInputProps) => {
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateCode = async (code: string) => {
    if (!code.trim()) {
      setValidationState('idle');
      setErrorMessage('');
      onReferralCodeChange('', false);
      return;
    }

    // Client-side format validation
    const formatValidation = validateReferralCode(code);
    if (!formatValidation.valid) {
      setValidationState('invalid');
      setErrorMessage(formatValidation.error || 'Ungültiges Format');
      onReferralCodeChange(code, false);
      return;
    }

    setIsValidating(true);
    
    try {
      const cleanCode = code.trim().toUpperCase();
      
      const { data, error } = await supabase
        .from('referral_codes')
        .select('id, user_id, is_active')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        secureLog('Referral code validation error:', error);
        setValidationState('invalid');
        setErrorMessage('Fehler bei der Validierung');
        onReferralCodeChange(code, false);
        return;
      }

      if (data) {
        setValidationState('valid');
        setErrorMessage('');
        onReferralCodeChange(cleanCode, true);
        secureLog('Valid referral code found', { codeId: data.id });
      } else {
        setValidationState('invalid');
        setErrorMessage('Empfehlungscode nicht gefunden oder inaktiv');
        onReferralCodeChange(code, false);
      }
    } catch (error) {
      secureLog('Referral code validation error:', error);
      setValidationState('invalid');
      setErrorMessage('Validierungsfehler');
      onReferralCodeChange(code, false);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateCode(referralCode);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [referralCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    setReferralCode(value);
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>;
    }
    
    switch (validationState) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode" className="text-sm text-gray-300">
        Empfehlungscode (optional)
      </Label>
      <div className="relative">
        <Input
          id="referralCode"
          type="text"
          placeholder="z.B. ABC12345"
          value={referralCode}
          onChange={handleInputChange}
          maxLength={8}
          className={`bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12 pr-10 ${
            validationState === 'valid' 
              ? 'border-green-500' 
              : validationState === 'invalid' 
              ? 'border-red-500' 
              : ''
          }`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}
      {validationState === 'valid' && (
        <p className="text-sm text-green-400">
          ✓ Gültiger Empfehlungscode - Sie erhalten 10 kostenlose Bilder!
        </p>
      )}
    </div>
  );
};

export default ReferralCodeInput;
