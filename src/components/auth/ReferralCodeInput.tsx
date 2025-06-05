
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Gift, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ReferralCodeInputProps {
  onReferralCodeChange: (code: string, isValid: boolean) => void;
}

const ReferralCodeInput = ({ onReferralCodeChange }: ReferralCodeInputProps) => {
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 6) {
      setValidationResult(null);
      onReferralCodeChange('', false);
      return;
    }

    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .from('referral_codes')
        .select('code, user_id')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setValidationResult('valid');
        onReferralCodeChange(code.toUpperCase(), true);
      } else {
        setValidationResult('invalid');
        onReferralCodeChange('', false);
      }
    } catch (error) {
      setValidationResult('invalid');
      onReferralCodeChange('', false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setReferralCode(upperValue);
    
    // Debounce validation
    setTimeout(() => validateReferralCode(upperValue), 500);
  };

  const getInputIcon = () => {
    if (isValidating) {
      return <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />;
    }
    if (validationResult === 'valid') {
      return <Check className="w-4 h-4 text-green-500" />;
    }
    if (validationResult === 'invalid') {
      return <X className="w-4 h-4 text-red-500" />;
    }
    return <Gift className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id="referralCode"
          name="referralCode"
          placeholder="Empfehlungscode (optional)"
          value={referralCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12 pr-10"
          maxLength={12}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getInputIcon()}
        </div>
      </div>
      
      {validationResult === 'valid' && (
        <p className="text-sm text-green-400 flex items-center">
          <Gift className="w-4 h-4 mr-2" />
          Gültiger Code! Der Empfehler erhält kostenfreie Bilder
        </p>
      )}
      
      {validationResult === 'invalid' && (
        <p className="text-sm text-red-400">
          Ungültiger Empfehlungscode
        </p>
      )}
      
      {!referralCode && (
        <p className="text-xs text-gray-500">
          Mit einem Empfehlungscode helfen Sie einem Freund kostenfreie Bilder zu erhalten
        </p>
      )}
    </div>
  );
};

export default ReferralCodeInput;
