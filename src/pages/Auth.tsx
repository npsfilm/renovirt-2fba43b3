
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

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const checkUserProfileAndRedirect = async () => {
      if (user) {
        if (user.email_confirmed_at) {
          try {
            const profile = await getCustomerProfile();
            
            if (profile && profile.first_name && profile.last_name && profile.role) {
              navigate(from, { replace: true });
            } else {
              navigate('/onboarding');
            }
          } catch (error) {
            navigate('/onboarding');
          }
        } else {
          navigate('/email-verification');
        }
      }
    };

    checkUserProfileAndRedirect();
  }, [user, navigate, getCustomerProfile, from]);

  const handleAuthSuccess = (isRegistration = false) => {
    if (isRegistration) {
      navigate('/email-verification');
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
      <div className="w-full mb-8">
        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full">
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
