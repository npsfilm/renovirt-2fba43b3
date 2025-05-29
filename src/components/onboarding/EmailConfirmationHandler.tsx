
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface EmailConfirmationHandlerProps {
  error?: string | null;
}

const EmailConfirmationHandler = ({ error }: EmailConfirmationHandlerProps) => {
  const handleRetry = () => {
    // Reload the page to retry the confirmation process
    window.location.reload();
  };

  const handleGoToAuth = () => {
    // Redirect to auth page
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {error ? (
            // Error State
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                E-Mail-Bestätigung fehlgeschlagen
              </h2>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Erneut versuchen
                </Button>
                <Button variant="outline" onClick={handleGoToAuth} className="w-full">
                  Zur Anmeldung
                </Button>
              </div>
            </>
          ) : (
            // Loading State
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                E-Mail wird bestätigt...
              </h2>
              <p className="text-gray-600">
                Bitte warten Sie, während wir Ihre E-Mail-Adresse bestätigen.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmationHandler;
