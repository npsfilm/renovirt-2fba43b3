
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { user } = useAuth();
  const { getCustomerProfile } = useCustomerProfile();
  const navigate = useNavigate();
  const location = useLocation();

  // Die Seite abrufen, die der Benutzer vor der Weiterleitung zur Anmeldung besuchen wollte
  const from = location.state?.from?.pathname || '/dashboard';

  // Weiterleitung wenn bereits angemeldet
  useEffect(() => {
    const checkUserProfileAndRedirect = async () => {
      if (user) {
        // Wenn Benutzer bestätigt ist (E-Mail verifiziert), Profilvollständigkeit prüfen
        if (user.email_confirmed_at) {
          try {
            const profile = await getCustomerProfile();
            
            // Wenn Profil existiert und erforderliche Felder hat, zur ursprünglich angeforderten Seite oder Dashboard gehen
            if (profile && profile.first_name && profile.last_name && profile.role) {
              navigate(from, { replace: true });
            } else {
              // Wenn Profil nicht existiert oder unvollständig ist, zum Onboarding gehen
              navigate('/onboarding');
            }
          } catch (error) {
            // Bei Fehler beim Abrufen des Profils, annehmen dass es nicht existiert
            navigate('/onboarding');
          }
        } else {
          // Wenn Benutzer nicht bestätigt ist, E-Mail-Verifizierungsbildschirm anzeigen
          navigate('/email-verification');
        }
      }
    };

    checkUserProfileAndRedirect();
  }, [user, navigate, getCustomerProfile, from]);

  const handleAuthSuccess = (isRegistration = false) => {
    if (isRegistration) {
      // Nach Registrierung zur E-Mail-Verifizierung weiterleiten
      navigate('/email-verification');
    } else {
      // Nach Anmeldung basierend auf E-Mail-Bestätigungsstatus und Profilvollständigkeit weiterleiten
      // Dies wird durch den useEffect oben gehandhabt
    }
  };

  const handleSwitchToRegister = () => {
    setActiveTab('register');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  return (
    <AuthLayout>
      {/* Custom Tab Navigation with light mode styling */}
      <div className="w-full mb-6">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full">
          <button
            onClick={() => setActiveTab('login')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'login'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'register'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Registrieren
          </button>
        </div>
      </div>

      {/* Forms */}
      {activeTab === 'login' && (
        <LoginForm 
          onSuccess={() => handleAuthSuccess(false)} 
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {activeTab === 'register' && (
        <RegisterForm 
          onSuccess={() => handleAuthSuccess(true)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </AuthLayout>
  );
};

export default Auth;
