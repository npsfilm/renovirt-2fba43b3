
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie E-Mail und Passwort ein.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email });
      const { data, error } = await signIn(formData.email, formData.password);
      
      console.log('Login result:', { data, error });
      
      if (error) {
        let errorMessage = 'Ein Fehler ist bei der Anmeldung aufgetreten.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Ungültige E-Mail oder Passwort.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Bitte bestätigen Sie Ihre E-Mail-Adresse.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.';
        }
        
        toast({
          title: 'Anmeldung fehlgeschlagen',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (data?.user) {
        console.log('Login successful for user:', data.user.email);
        toast({
          title: 'Erfolgreich angemeldet',
          description: 'Willkommen zurück!',
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      console.log('Attempting Google authentication');
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google auth error:', error);
        toast({
          title: 'Google-Anmeldung fehlgeschlagen',
          description: error.message || 'Fehler bei der Google-Anmeldung.',
          variant: 'destructive',
        });
      } else {
        console.log('Google auth initiated successfully');
        // Google auth will redirect, so no need to call onSuccess here
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">Anmelden</h1>
        <p className="text-gray-400 text-sm">
          Haben Sie noch kein Konto?{' '}
          <button className="text-white underline hover:no-underline">
            Registrieren
          </button>
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-12" 
          onClick={handleGoogleAuth}
          disabled={loading}
          type="button"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Mit Google anmelden
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-950 px-2 text-gray-400">oder</span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        E-Mail und Passwort eingeben zum Anmelden
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ihre.email@beispiel.de"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
          />
        </div>
        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100 h-12 font-medium" disabled={loading}>
          {loading ? 'Wird angemeldet...' : 'Anmelden'}
        </Button>
      </form>
      
      <div className="text-center text-sm text-gray-400">
        <Link to="/forgot-password" className="hover:text-white transition-colors">
          Passwort vergessen?
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
