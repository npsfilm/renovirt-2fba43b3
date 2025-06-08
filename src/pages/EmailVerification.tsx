
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const EmailVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  // Countdown-Timer für Resend-Sperre (60 Sekunden)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!user?.email || countdown > 0) return;
    
    setIsResending(true);
    
    try {
      console.log('Attempting to resend verification email to:', user.email);
      
      // Supabase's resend verification email
      const { error } = await user.resend({ 
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`
        }
      });
      
      if (error) {
        console.error('Error resending verification email:', error);
        
        let errorMessage = "Die E-Mail konnte nicht erneut gesendet werden.";
        if (error.message.includes('rate_limit')) {
          errorMessage = "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
        } else if (error.message.includes('email_already_confirmed')) {
          errorMessage = "Ihre E-Mail-Adresse ist bereits bestätigt. Sie können sich jetzt anmelden.";
        }
        
        toast({
          title: "Fehler beim E-Mail-Versand",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Verification email resent successfully');
        
        const newResendCount = resendCount + 1;
        setResendCount(newResendCount);
        setLastResendTime(Date.now());
        setCountdown(60); // 60 Sekunden Wartezeit
        
        toast({
          title: "E-Mail gesendet",
          description: `Wir haben Ihnen eine neue Bestätigungs-E-Mail gesendet. ${newResendCount > 1 ? `(${newResendCount}. Versuch)` : ''}`,
        });
      }
    } catch (error: any) {
      console.error('Unexpected error during email resend:', error);
      toast({
        title: "Unerwarteter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const getResendButtonText = () => {
    if (isResending) return "Wird gesendet...";
    if (countdown > 0) return `Erneut senden in ${countdown}s`;
    if (resendCount > 0) return "E-Mail erneut senden";
    return "E-Mail erneut senden";
  };

  const isResendDisabled = isResending || countdown > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            E-Mail-Adresse bestätigen
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
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

          {/* Status-Informationen */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Wichtige Hinweise</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Überprüfen Sie auch Ihren Spam-Ordner</p>
              <p>• Der Link ist 24 Stunden gültig</p>
              <p>• Nach der Bestätigung werden Sie automatisch weitergeleitet</p>
            </div>
          </div>

          {/* Resend-Informationen */}
          {resendCount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">
                  E-Mail wurde {resendCount}x erneut gesendet
                </span>
              </div>
              {lastResendTime > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Letzte Sendung: {new Date(lastResendTime).toLocaleTimeString('de-DE')}
                </p>
              )}
            </div>
          )}

          {/* Resend Button */}
          <Button 
            variant="outline" 
            onClick={handleResendEmail}
            disabled={isResendDisabled}
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
            {getResendButtonText()}
          </Button>

          {/* Rate Limiting Info */}
          {countdown > 0 && (
            <p className="text-xs text-gray-500">
              Aus Sicherheitsgründen können E-Mails nur alle 60 Sekunden erneut gesendet werden.
            </p>
          )}

          {/* Hilfetext */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <strong>Probleme beim Empfang?</strong>
            </p>
            <div className="text-xs space-y-1">
              <p>1. Überprüfen Sie Ihren Spam-/Junk-Ordner</p>
              <p>2. Stellen Sie sicher, dass E-Mails von Renovirt nicht blockiert werden</p>
              <p>3. Warten Sie einige Minuten - manchmal dauert die Zustellung etwas länger</p>
            </div>
          </div>

          {/* Kontakt */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-400">
              Immer noch Probleme? Kontaktieren Sie uns unter{' '}
              <a href="mailto:support@renovirt.de" className="text-blue-600 hover:underline">
                support@renovirt.de
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
