
import { useState, useEffect } from 'react';
import { useCustomEmailResend } from '@/hooks/useCustomEmailResend';
import { useAuth } from '@/hooks/useAuth';
import { useVerificationAttempts, VerificationAttempt } from './useVerificationAttempts';
import { useEmailVerificationStatus } from './useEmailVerificationStatus';
import { useRetryLogic } from './useRetryLogic';
import { useSmartSuggestions } from './useSmartSuggestions';

export const useEnhancedEmailResend = () => {
  const { user } = useAuth();
  const { resendVerificationEmail, isLoading, canResend } = useCustomEmailResend();
  const { attempts, addAttempt, getTotalAttempts } = useVerificationAttempts();
  const { emailStatus, setEmailStatus } = useEmailVerificationStatus();
  const { retryDelay, updateRetryDelay, calculateRetryDelay } = useRetryLogic();
  const { smartSuggestions, generateSmartSuggestions } = useSmartSuggestions();
  
  const [isRetrying, setIsRetrying] = useState(false);

  // Enhanced resend with smart retry logic
  const enhancedResend = async (forceRetry: boolean = false) => {
    if (!user?.email || (!canResend() && !forceRetry)) return;

    const currentAttemptCount = attempts.length;
    setEmailStatus('sending');
    setIsRetrying(true);

    try {
      const result = await resendVerificationEmail(
        user.email,
        user.user_metadata?.first_name,
        user.user_metadata?.last_name
      );

      const attempt: VerificationAttempt = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        method: result.data?.method || 'supabase',
        success: result.success,
        retryCount: currentAttemptCount
      };

      addAttempt(attempt);

      if (result.success) {
        setEmailStatus('sent');
        generateSmartSuggestions(user.email, currentAttemptCount);
        updateRetryDelay(currentAttemptCount);
      } else {
        setEmailStatus('idle');
        // Auto-retry with exponential backoff if not too many attempts
        if (currentAttemptCount < 3) {
          const retryDelayMs = calculateRetryDelay(currentAttemptCount) * 1000;
          setTimeout(() => {
            enhancedResend(true);
          }, retryDelayMs);
        }
      }
    } catch (error) {
      setEmailStatus('idle');
      console.error('Enhanced resend failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Auto-retry logic for failed attempts
  useEffect(() => {
    const lastAttempt = attempts[attempts.length - 1];
    if (lastAttempt && !lastAttempt.success && attempts.length < 3) {
      const retryDelayMs = calculateRetryDelay(attempts.length) * 1000;
      const timer = setTimeout(() => {
        enhancedResend(true);
      }, retryDelayMs);
      
      return () => clearTimeout(timer);
    }
  }, [attempts]);

  return {
    enhancedResend,
    attempts,
    isRetrying: isRetrying || isLoading,
    canResend: canResend(),
    retryDelay,
    emailStatus,
    smartSuggestions,
    totalAttempts: getTotalAttempts()
  };
};
