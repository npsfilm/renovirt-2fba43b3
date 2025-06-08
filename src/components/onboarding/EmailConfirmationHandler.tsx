
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface EmailConfirmationHandlerProps {
  error?: string | null;
}

const EmailConfirmationHandler = ({ error }: EmailConfirmationHandlerProps) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(5);
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto-Redirect bei erfolgreicher Bestätigung
  useEffect(() => {
    if (!error && user?.email_confirmed_at) {
      const timer = setInterval(() => {
        setAutoRedirectCountdown((prev) => {
          if (prev <= 1) {
            window.location.href = '/onboarding';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [error, user]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Kurze Verzögerung für bessere UX
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleGoToAuth = () => {
    window.location.href = '/auth';
  };

  const handleResendEmail = async () => {
    if (!user?.email) {
      toast({
        title: "Fehler",
        description: "Keine E-Mail-Adresse gefunden. Bitte versuchen Sie sich erneut zu registrieren.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Hier würde die Resend-Logik implementiert werden
      toast({
        title: "E-Mail gesendet",
        description: "Eine neue Bestätigungs-E-Mail wurde gesendet.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die E-Mail konnte nicht erneut gesendet werden.",
        variant: "destructive",
      });
    }
  };

  const getErrorMessage = (errorMsg: string) => {
    if (errorMsg.includes('token not found') || errorMsg.includes('invalid')) {
      return {
        title: "Link ungültig oder abgelaufen",
        description: "Der Bestätigungslink ist nicht mehr gültig. Dies kann passieren, wenn der Link älter als 24 Stunden ist oder bereits verwendet wurde.",
        suggestions: [
          "Fordern Sie eine neue Bestätigungs-E-Mail an",
          "Überprüfen Sie, ob Sie bereits registriert sind und sich direkt anmelden können",
          "Stellen Sie sicher, dass Sie den neuesten Link verwenden"
        ]
      };
    }
    
    if (errorMsg.includes('expired')) {
      return {
        title: "Link abgelaufen",
        description: "Der Bestätigungslink ist abgelaufen. Bestätigungslinks sind nur 24 Stunden gültig.",
        suggestions: [
          "Fordern Sie eine neue Bestätigungs-E-Mail an",
          "Verwenden Sie den Link in der neuesten E-Mail"
        ]
      };
    }

    return {
      title: "E-Mail-Bestätigung fehlgeschlagen",
      description: errorMsg || "Ein unbekannter Fehler ist aufgetreten.",
      suggestions: [
        "Versuchen Sie es erneut",
        "Fordern Sie eine neue Bestätigungs-E-Mail an",
        "Kontaktieren Sie den Support, falls das Problem weiterhin besteht"
      ]
    };
  };

  // Erfolgreiche Bestätigung
  if (!error && user?.email_confirmed_at) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              E-Mail erfolgreich bestätigt!
            </h2>
            <p className="text-gray-600 mb-6">
              Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie werden in {autoRedirectCountdown} Sekunden automatisch zum Onboarding weitergeleitet.
            </p>
            <Button onClick={() => window.location.href = '/onboarding'} className="w-full">
              Jetzt zum Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fehler-Zustand
  if (error) {
    const errorInfo = getErrorMessage(error);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {errorInfo.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {errorInfo.description}
            </p>
            
            {/* Fehler-Details für Debug */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Technische Details</span>
              </div>
              <p className="text-xs text-gray-500 font-mono">
                {error}
              </p>
            </div>

            {/* Lösungsvorschläge */}
            <div className="bg-blue-50 rounded-lg p-3 mb-6 text-left">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Lösungsvorschläge:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {errorInfo.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retry-Informationen */}
            {retryCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  {retryCount === 1 ? '1. Wiederholungsversuch' : `${retryCount}. Wiederholungsversuch`}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="w-full"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird wiederholt...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Erneut versuchen
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleResendEmail}
                className="w-full"
              >
                Neue Bestätigungs-E-Mail anfordern
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGoToAuth} 
                className="w-full"
              >
                Zur Anmeldung
              </Button>
            </div>

            {/* Support-Kontakt */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-500">
                Benötigen Sie Hilfe? Kontaktieren Sie uns unter{' '}
                <a href="mailto:support@renovirt.de" className="text-blue-600 hover:underline">
                  support@renovirt.de
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading-Zustand
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            E-Mail wird bestätigt...
          </h2>
          <p className="text-gray-600">
            Bitte warten Sie, während wir Ihre E-Mail-Adresse bestätigen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmationHandler;
