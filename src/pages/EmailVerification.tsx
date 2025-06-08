
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedEmailVerification } from '@/hooks/useEnhancedEmailVerification';
import { useEnhancedRegistrationToastHelper } from '@/components/auth/EnhancedRegistrationToastHelper';

const EmailVerification = () => {
  const { user } = useAuth();
  const {
    enhancedResend,
    attempts,
    isRetrying,
    canResend,
    retryDelay,
    emailStatus,
    smartSuggestions,
    getEmailProviderInfo,
    totalAttempts
  } = useEnhancedEmailVerification();
  
  const { showEmailSentSuccess, showEmailResendError } = useEnhancedRegistrationToastHelper();
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for UI feedback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Update countdown based on retry delay
  useEffect(() => {
    if (!canResend && retryDelay > 0) {
      setCountdown(retryDelay);
    }
  }, [canResend, retryDelay]);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    try {
      await enhancedResend();
      setCountdown(retryDelay);
      showEmailSentSuccess(totalAttempts > 0, attempts[attempts.length - 1]?.method);
    } catch (error: any) {
      showEmailResendError(error);
    }
  };

  const getButtonText = () => {
    if (isRetrying) return "Sending...";
    if (!canResend && countdown > 0) return `Wait ${countdown}s`;
    return "Resend Email";
  };

  const emailProviderInfo = user?.email ? getEmailProviderInfo(user.email) : null;
  const hasEmailBeenSent = emailStatus !== 'idle' || totalAttempts > 0;

  // Get one smart suggestion based on attempts
  const getSmartHint = () => {
    if (totalAttempts === 0) return null;
    if (totalAttempts === 1) return "Check your spam folder";
    if (totalAttempts >= 2) return "Try adding our email to your contacts";
    return null;
  };

  const smartHint = getSmartHint();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-medium text-gray-900">
              Check your email
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600">
                We sent a verification link to
              </p>
              <p className="font-medium text-gray-900 bg-gray-50 rounded-lg p-3 text-sm">
                {user?.email}
              </p>
            </div>

            {/* Simple Status Indicator */}
            {hasEmailBeenSent && (
              <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Email sent</span>
              </div>
            )}

            {/* Smart Hint */}
            {smartHint && (
              <div className="text-sm text-gray-500 bg-blue-50 rounded-lg p-3">
                💡 {smartHint}
              </div>
            )}

            {/* Action Button */}
            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isRetrying || (!canResend && countdown > 0)}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {getButtonText()}
            </Button>

            {/* Email Provider Helper */}
            {emailProviderInfo && (
              <p className="text-xs text-gray-400">
                Open{' '}
                <button
                  onClick={() => window.open(emailProviderInfo.url, '_blank')}
                  className="text-blue-600 hover:underline"
                >
                  {emailProviderInfo.name}
                </button>{' '}
                to check your inbox
              </p>
            )}

            {/* Contact Support */}
            <p className="text-xs text-gray-400 pt-4 border-t">
              Need help?{' '}
              <a href="mailto:support@renovirt.de" className="text-blue-600 hover:underline">
                Contact support
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
