
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({
        text: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage({
          text: 'Es gab ein Problem beim Senden der E-Mail. Bitte versuchen Sie es erneut.',
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Wenn ein Account mit dieser E-Mail existiert, senden wir Ihnen einen Link zum zurücksetzen.',
          type: 'success'
        });
      }
    } catch (error) {
      setMessage({
        text: 'Ein unerwarteter Fehler ist aufgetreten.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Passwort vergessen
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              E-Mail-Adresse
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ihre.email@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-9 sm:h-10 lg:h-11 text-sm sm:text-base"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-9 sm:h-10 lg:h-11 text-sm sm:text-base font-medium" 
            disabled={loading}
          >
            {loading ? 'Wird gesendet...' : 'Passwort zurücksetzen'}
          </Button>
        </form>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="border">
            <AlertDescription className="text-sm">
              {message.text}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="text-center">
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
