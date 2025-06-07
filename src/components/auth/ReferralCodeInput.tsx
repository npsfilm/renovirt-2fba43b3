
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { validateReferralCode } from '@/utils/enhancedSecurityValidation';
import { secureLog } from '@/utils/secureLogging';

interface ReferralCodeInputProps {
  onReferralCodeChange: (code: string, isValid: boolean) => void;
}

const ReferralCodeInput = ({ onReferralCodeChange }: ReferralCodeInputProps) => {
  const [referralCode, setReferralCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'valid' | 'invalid' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const validateCode = async (code: string) => {
    if (!code.trim()) {
      setValidationState('idle');
      setErrorMessage('');
      onReferralCodeChange('', false);
      return;
    }

    // Client-side format validation with improved logic
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
      console.log('🔍 Validating referral code:', cleanCode);
      
      // First, let's check what referral codes exist in the database
      const { data: allCodes, error: allCodesError } = await supabase
        .from('referral_codes')
        .select('code, is_active, user_id')
        .limit(10);

      console.log('📋 Available referral codes sample:', allCodes);
      console.log('❌ All codes error:', allCodesError);

      const { data, error } = await supabase
        .from('referral_codes')
        .select('id, user_id, is_active, code')
        .eq('code', cleanCode)
        .eq('is_active', true)
        .maybeSingle();

      console.log('🎯 Specific code query result:', { 
        searchedCode: cleanCode,
        data, 
        error,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : null
      });

      if (error) {
        console.error('❌ Database error during validation:', error);
        secureLog('Referral code validation database error:', error);
        setValidationState('error');
        setErrorMessage('Datenbankfehler. Bitte versuchen Sie es erneut.');
        onReferralCodeChange(code, false);
        return;
      }

      if (data) {
        console.log('✅ Valid referral code found:', data);
        setValidationState('valid');
        setErrorMessage('');
        setRetryCount(0);
        onReferralCodeChange(cleanCode, true);
        secureLog('Valid referral code found', { codeId: data.id });
      } else {
        console.log('❌ Referral code not found or inactive:', cleanCode);
        
        // Let's also check if the code exists but is inactive
        const { data: inactiveCheck } = await supabase
          .from('referral_codes')
          .select('code, is_active')
          .eq('code', cleanCode)
          .maybeSingle();

        console.log('🔍 Inactive code check:', inactiveCheck);

        if (inactiveCheck && !inactiveCheck.is_active) {
          setValidationState('invalid');
          setErrorMessage('Empfehlungscode ist deaktiviert');
        } else {
          setValidationState('invalid');
          setErrorMessage('Empfehlungscode nicht gefunden');
        }
        onReferralCodeChange(code, false);
      }
    } catch (error) {
      console.error('💥 Unexpected error during referral code validation:', error);
      secureLog('Referral code validation unexpected error:', error);
      setValidationState('error');
      setErrorMessage('Unerwarteter Fehler. Bitte versuchen Sie es erneut.');
      onReferralCodeChange(code, false);
    } finally {
      setIsValidating(false);
    }
  };

  // Retry logic for failed validations
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      validateCode(referralCode);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (referralCode.trim()) {
        validateCode(referralCode);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [referralCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow more flexible input handling - accept the input as-is and clean it up during validation
    const value = e.target.value.toUpperCase().slice(0, 12);
    setReferralCode(value);
    
    // Reset validation state when user types
    if (validationState === 'error') {
      setValidationState('idle');
      setErrorMessage('');
    }
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
      case 'error':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
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
          maxLength={12}
          className={`bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12 pr-10 ${
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
          {getValidationIcon()}
        </div>
      </div>
      
      {errorMessage && (
        <div className="space-y-2">
          <p className={`text-sm ${
            validationState === 'error' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {errorMessage}
          </p>
          {validationState === 'error' && retryCount < 3 && (
            <button
              onClick={handleRetry}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Erneut versuchen
            </button>
          )}
        </div>
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
