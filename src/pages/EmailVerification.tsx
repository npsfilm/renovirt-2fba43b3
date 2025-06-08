
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
    totalAttempts
  } = useEnhancedEmailVerification();
  
  const { showEmailSentSuccess, showEmailResendError } = useEnhancedRegistrationToastHelper();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
    if (isRetrying) return "Wird gesendet...";
    if (!canResend && countdown > 0) return `Warten ${countdown}s`;
    return "E-Mail erneut senden";
  };

  const hasEmailBeenSent = emailStatus !== 'idle' || totalAttempts > 0;

  const getSmartHint = () => {
    if (totalAttempts === 0) return null;
    if (totalAttempts === 1) return "Überprüfen Sie Ihren Spam-Ordner";
    if (totalAttempts >= 2) return "Fügen Sie unsere E-Mail zu Ihren Kontakten hinzu";
    return null;
  };

  const smartHint = getSmartHint();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl font-medium text-foreground">
              E-Mail überprüfen
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Wir haben einen Bestätigungslink gesendet an
              </p>
              <p className="font-medium text-foreground bg-muted rounded-lg p-3 text-sm">
                {user?.email}
              </p>
            </div>

            {hasEmailBeenSent && (
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 rounded-lg p-3">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">E-Mail gesendet</span>
              </div>
            )}

            {smartHint && (
              <div className="text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                💡 {smartHint}
              </div>
            )}

            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isRetrying || (!canResend && countdown > 0)}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {getButtonText()}
            </Button>

            <p className="text-xs text-muted-foreground pt-4 border-t">
              Benötigen Sie Hilfe?{' '}
              <a href="mailto:support@fotoedit.de" className="text-primary hover:underline">
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
