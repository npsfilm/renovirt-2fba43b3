
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Default role to 'customer' since we removed the role selector
      const { error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'customer',
      });

      if (error) {
        toast({
          title: 'Registrierung fehlgeschlagen',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Registrierung erfolgreich',
          description: 'Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.',
        });
        onSuccess();
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

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: 'Google-Registrierung fehlgeschlagen',
          description: error.message,
          variant: 'destructive',
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">Konto erstellen</h1>
        <p className="text-gray-400 text-sm">
          Haben Sie bereits ein Konto?{' '}
          <button className="text-white underline hover:no-underline">
            Anmelden
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
          Mit Google registrieren
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

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              id="firstName"
              name="firstName"
              placeholder="Vorname"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="lastName"
              name="lastName"
              placeholder="Nachname"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Input
            id="registerEmail"
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
            id="registerPassword"
            name="password"
            type="password"
            placeholder="Passwort"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
          />
        </div>
        
        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100 h-12 font-medium" disabled={loading}>
          {loading ? 'Wird erstellt...' : 'Konto erstellen'}
        </Button>
      </form>
      
      <div className="text-center text-xs text-gray-400 leading-relaxed">
        Mit der Registrierung stimmen Sie unseren{' '}
        <Link to="/terms" className="hover:text-white transition-colors">
          AGB
        </Link>{' '}
        und der{' '}
        <Link to="/privacy" className="hover:text-white transition-colors">
          Datenschutzerklärung
        </Link>{' '}
        zu.
      </div>
    </div>
  );
};

export default RegisterForm;
