
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedEmailVerification } from '@/hooks/useEnhancedEmailVerification';
import { useEnhancedRegistrationToastHelper } from '@/components/auth/EnhancedRegistrationToastHelper';
import VerificationProgress from '@/components/email-verification/VerificationProgress';
import SmartSuggestions from '@/components/email-verification/SmartSuggestions';

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
    getVerificationProgress,
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

  const getResendButtonText = () => {
    if (isRetrying) return "Wird gesendet...";
    if (!canResend && countdown > 0) return `Bereit in ${countdown}s`;
    if (totalAttempts > 0) return "🚀 Erneut senden (smart)";
    return "E-Mail erneut senden";
  };

  const emailProviderInfo = user?.email ? getEmailProviderInfo(user.email) : null;
  const { steps, progressPercentage } = getVerificationProgress();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              E-Mail-Adresse bestätigen
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600">
                Wir haben eine Bestätigungs-E-Mail an
              </p>
              <p className="font-medium text-gray-900 bg-gray-50 rounded-lg p-2">
                {user?.email}
              </p>
              <p className="text-gray-600">
                gesendet. Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
              </p>
            </div>

            {/* Verification Progress */}
            <VerificationProgress 
              steps={steps} 
              progressPercentage={progressPercentage} 
            />

            {/* Status Information */}
            {emailStatus === 'sent' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">E-Mail erfolgreich versendet</span>
                </div>
                {attempts.length > 0 && (
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      {attempts[attempts.length - 1]?.method === 'resend_custom' ? 'Schneller Versand' : 'Standard-Versand'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Attempt History */}
            {totalAttempts > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-blue-800 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {totalAttempts === 1 ? '1 Versuch' : `${totalAttempts} Versuche`}
                  </span>
                </div>
                <div className="text-xs text-blue-600 space-y-1">
                  {attempts.slice(-2).map((attempt, index) => (
                    <div key={attempt.id} className="flex justify-between">
                      <span>{new Date(attempt.timestamp).toLocaleTimeString('de-DE')}</span>
                      <span className={attempt.success ? 'text-green-600' : 'text-red-600'}>
                        {attempt.success ? 'Erfolgreich' : 'Fehlgeschlagen'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Resend Button */}
            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isRetrying || (!canResend && countdown > 0)}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {getResendButtonText()}
            </Button>

            {/* Smart Rate Limiting Info */}
            {!canResend && countdown > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-yellow-800">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Intelligente Pause für optimale Zustellung</span>
                </div>
                <p className="text-xs text-yellow-600 mt-1 text-center">
                  Unser System verhindert Spam-Filter durch smarte Verzögerung
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Suggestions */}
        <SmartSuggestions 
          suggestions={smartSuggestions}
          emailProviderInfo={emailProviderInfo}
          email={user?.email || ''}
        />

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Benötigen Sie sofortige Hilfe? Kontaktieren Sie uns unter{' '}
            <a href="mailto:support@renovirt.de" className="text-blue-600 hover:underline">
              support@renovirt.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
