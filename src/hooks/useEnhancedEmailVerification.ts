
import { useEnhancedEmailResend } from './email-verification/useEnhancedEmailResend';
import { useEmailProviderInfo } from './email-verification/useEmailProviderInfo';
import { useVerificationProgress } from './email-verification/useVerificationProgress';

export const useEnhancedEmailVerification = () => {
  const {
    enhancedResend,
    attempts,
    isRetrying,
    canResend,
    retryDelay,
    emailStatus,
    smartSuggestions,
    totalAttempts
  } = useEnhancedEmailResend();

  const { getEmailProviderInfo } = useEmailProviderInfo();
  const { getVerificationProgress } = useVerificationProgress();

  return {
    enhancedResend,
    attempts,
    isRetrying,
    canResend,
    retryDelay,
    emailStatus,
    smartSuggestions,
    getEmailProviderInfo,
    getVerificationProgress: () => getVerificationProgress(emailStatus),
    totalAttempts
  };
};
