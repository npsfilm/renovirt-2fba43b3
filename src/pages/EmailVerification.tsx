
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Clock, Zap, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomEmailResend } from '@/hooks/useCustomEmailResend';
import { useRegistrationToastHelper } from '@/components/auth/RegistrationToastHelper';

const EmailVerification = () => {
  const { user } = useAuth();
  const { resendVerificationEmail, isLoading: customResendLoading, canResend } = useCustomEmailResend();
  const { showEmailSentSuccess, showEmailResendError } = useRegistrationToastHelper();
  
  const [countdown, setCountdown] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [deliveryMethod, setDeliveryMethod] = useState<'supabase' | 'resend_custom' | null>(null);

  // Countdown timer for UI feedback (separate from actual rate limiting)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-check email provider for helpful hints
  const getEmailProvider = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const providers = {
      'gmail.com': { name: 'Gmail', url: 'https://mail.google.com' },
      'outlook.com': { name: 'Outlook', url: 'https://outlook.live.com' },
      'hotmail.com': { name: 'Outlook', url: 'https://outlook.live.com' },
      'web.de': { name: 'Web.de', url: 'https://web.de' },
      'gmx.de': { name: 'GMX', url: 'https://gmx.de' },
      'yahoo.com': { name: 'Yahoo', url: 'https://mail.yahoo.com' },
    };
    return providers[domain] || null;
  };

  const handleResendEmail = async () => {
    if (!user?.email || !canResend()) return;
    
    setEmailStatus('sending');
    
    try {
      console.log('Attempting fast email resend to:', user.email);
      
      // Try custom resend first (faster, no rate limits)
      const result = await resendVerificationEmail(
        user.email,
        user.user_metadata?.first_name,
        user.user_metadata?.last_name
      );
      
      if (result.success) {
        console.log('Custom email resend successful:', result.data);
        
        const newResendCount = resendCount + 1;
        setResendCount(newResendCount);
        setLastResendTime(Date.now());
        setCountdown(10); // Shorter countdown for better UX
        setEmailStatus('sent');
        setDeliveryMethod(result.data.method);
        
        showEmailSentSuccess(true);
      } else {
        throw result.error;
      }
    } catch (error: any) {
      console.error('Fast email resend failed:', error);
      setEmailStatus('error');
      showEmailResendError(error);
    }
  };

  const getResendButtonText = () => {
    if (emailStatus === 'sending' || customResendLoading) return "Wird gesendet...";
    if (!canResend()) return `Warten Sie ${Math.ceil((10000 - (Date.now() - lastResendTime)) / 1000)}s`;
    if (countdown > 0) return `Bereit in ${countdown}s`;
    if (resendCount > 0) return "🚀 Erneut senden (schnell)";
    return "E-Mail erneut senden";
  };

  const isResendDisabled = emailStatus === 'sending' || customResendLoading || !canResend();
  const emailProvider = user?.email ? getEmailProvider(user.email) : null;

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

          {/* Email Provider Quick Access */}
          {emailProvider && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {emailProvider.name} direkt öffnen
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(emailProvider.url, '_blank')}
              >
                Zu {emailProvider.name}
              </Button>
            </div>
          )}

          {/* Status Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Wichtige Hinweise</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Überprüfen Sie auch Ihren Spam-Ordner</p>
              <p>• Der Link ist 24 Stunden gültig</p>
              <p>• Nach der Bestätigung werden Sie automatisch weitergeleitet</p>
              <p>• Unser verbessertes System sendet E-Mails sofort</p>
            </div>
          </div>

          {/* Delivery Status */}
          {emailStatus === 'sent' && deliveryMethod && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">
                  E-Mail erfolgreich versendet
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Zap className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">
                  {deliveryMethod === 'resend_custom' ? 'Schneller Versand' : 'Standard-Versand'}
                </span>
              </div>
            </div>
          )}

          {/* Resend Information */}
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

          {/* Enhanced Resend Button */}
          <Button 
            variant="outline" 
            onClick={handleResendEmail}
            disabled={isResendDisabled}
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${(emailStatus === 'sending' || customResendLoading) ? 'animate-spin' : ''}`} />
            {getResendButtonText()}
          </Button>

          {/* Smart Rate Limiting Info */}
          {!canResend() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Kurze Pause für optimale Zustellung</span>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                Unser System verhindert Spam-Filter durch intelligente Verzögerung
              </p>
            </div>
          )}

          {/* Enhanced Help Text */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <strong>Immer noch keine E-Mail erhalten?</strong>
            </p>
            <div className="text-xs space-y-1">
              <p>1. ✅ Spam-/Junk-Ordner überprüfen</p>
              <p>2. ✅ E-Mails von renovirt.de freigeben</p>
              <p>3. ✅ Internetverbindung prüfen</p>
              <p>4. 🚀 Erneut senden für sofortige Zustellung</p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-400">
              Benötigen Sie sofortige Hilfe? Kontaktieren Sie uns unter{' '}
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
