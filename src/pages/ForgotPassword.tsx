
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: 'Fehler',
          description: 'Es gab ein Problem beim Senden der E-Mail. Bitte versuchen Sie es erneut.',
          variant: 'destructive',
        });
      } else {
        setEmailSent(true);
        toast({
          title: 'E-Mail gesendet',
          description: 'Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts gesendet.',
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-semibold text-white">E-Mail gesendet</h1>
          <div className="space-y-4">
            <p className="text-gray-400">
              Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts an{' '}
              <span className="text-white font-medium">{email}</span> gesendet.
            </p>
            <p className="text-gray-400 text-sm">
              Überprüfen Sie Ihren Posteingang und folgen Sie den Anweisungen in der E-Mail.
            </p>
          </div>
          <div className="pt-4">
            <Link 
              to="/auth" 
              className="text-white underline hover:no-underline"
            >
              ← Zurück zur Anmeldung
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">Passwort vergessen</h1>
          <p className="text-gray-400 text-sm">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ihre.email@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-100 h-12 font-medium" 
            disabled={loading}
          >
            {loading ? 'Wird gesendet...' : 'Passwort zurücksetzen'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-gray-400">
          <Link to="/auth" className="hover:text-white transition-colors">
            ← Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
