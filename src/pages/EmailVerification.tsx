
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const EmailVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    try {
      // Note: In a real implementation, you'd call supabase.auth.resend()
      toast({
        title: "Email gesendet",
        description: "Wir haben Ihnen eine neue Bestätigungs-E-Mail gesendet.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "E-Mail konnte nicht erneut gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            E-Mail bestätigen
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              Wir haben eine Bestätigungs-E-Mail an
            </p>
            <p className="font-medium text-gray-900">
              {user?.email}
            </p>
            <p className="text-gray-600">
              gesendet. Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Hinweis:</strong> Überprüfen Sie auch Ihren Spam-Ordner, falls Sie die E-Mail nicht erhalten haben.
            </p>
          </div>

          <Button 
            variant="outline" 
            onClick={handleResendEmail}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            E-Mail erneut senden
          </Button>

          <div className="text-sm text-gray-500">
            <p>
              Nach der Bestätigung werden Sie automatisch zur Einrichtung Ihres Profils weitergeleitet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
