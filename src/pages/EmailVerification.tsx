
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, Check, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedEmailVerification } from '@/hooks/useEnhancedEmailVerification';
import { useEnhancedRegistrationToastHelper } from '@/components/auth/EnhancedRegistrationToastHelper';
import { EmailChangeModal } from '@/components/profile/EmailChangeModal';

const EmailVerification = () => {
  const { user } = useAuth();
  const [isEmailChangeModalOpen, setIsEmailChangeModalOpen] = useState(false);
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

  // Countdown timer für UI-Feedback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Countdown basierend auf retry delay aktualisieren
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

  const handleCorrectEmail = () => {
    setIsEmailChangeModalOpen(true);
  };

  const getButtonText = () => {
    if (isRetrying) return "Wird gesendet...";
    if (!canResend && countdown > 0) return `Warten Sie ${countdown}s`;
    return "E-Mail erneut senden";
  };

  const emailProviderInfo = user?.email ? getEmailProviderInfo(user.email) : null;
  const hasEmailBeenSent = emailStatus !== 'idle' || totalAttempts > 0;

  // Intelligenten Hinweis basierend auf Versuchen abrufen
  const getSmartHint = () => {
    if (totalAttempts === 0) return null;
    if (totalAttempts === 1) return "Überprüfen Sie Ihren Spam-Ordner";
    if (totalAttempts >= 2) return "Versuchen Sie, unsere E-Mail-Adresse zu Ihren Kontakten hinzuzufügen";
    return null;
  };

  const smartHint = getSmartHint();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl font-medium text-foreground">
              Fast geschafft!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Wir haben einen Bestätigungslink gesendet an
              </p>
              <p className="font-medium text-foreground bg-muted rounded-lg p-3 text-sm">
                {user?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
              </p>
            </div>

            {/* Einfacher Status-Indikator */}
            {hasEmailBeenSent && (
              <div className="flex items-center justify-center gap-2 text-success bg-success/10 rounded-lg p-3">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">E-Mail gesendet</span>
              </div>
            )}

            {/* Prominenter Spam-Hinweis */}
            <div className="text-sm text-muted-foreground bg-accent/30 rounded-lg p-3 border border-accent/50">
              <p>Keine E-Mail erhalten? Überprüfen Sie bitte auch Ihren <strong>Spam-Ordner</strong>.</p>
            </div>

            {/* Intelligenter Hinweis */}
            {smartHint && (
              <div className="text-sm text-muted-foreground bg-accent/50 rounded-lg p-3">
                💡 {smartHint}
              </div>
            )}

            {/* Aktions-Button */}
            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isRetrying || (!canResend && countdown > 0)}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {getButtonText()}
            </Button>

            {/* E-Mail-Korrektur und Anbieter-Hilfe */}
            <div className="space-y-3">
              <button
                onClick={handleCorrectEmail}
                className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Falsche E-Mail-Adresse? Hier ändern
              </button>

              {emailProviderInfo && (
                <p className="text-xs text-muted-foreground">
                  Öffnen Sie{' '}
                  <button
                    onClick={() => window.open(emailProviderInfo.url, '_blank')}
                    className="text-primary hover:underline"
                  >
                    {emailProviderInfo.name}
                  </button>{' '}
                  um Ihren Posteingang zu überprüfen
                </p>
              )}
            </div>

            {/* Support kontaktieren */}
            <p className="text-xs text-muted-foreground pt-4 border-t">
              Benötigen Sie Hilfe?{' '}
              <a href="mailto:support@renovirt.de" className="text-primary hover:underline">
                Support kontaktieren
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
