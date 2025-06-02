
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
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

        {message && (
          <div className={`p-4 rounded-md border ${
            message.type === 'success' 
              ? 'bg-green-900/20 border-green-700 text-green-400' 
              : 'bg-red-900/20 border-red-700 text-red-400'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}
        
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
