
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // If user is confirmed (email verified), go to onboarding or home
      if (user.email_confirmed_at) {
        // Check if user has completed onboarding by checking for customer profile
        // For now, just redirect to onboarding - you can add profile check later
        navigate('/onboarding');
      } else {
        // If user is not confirmed, show email verification screen
        navigate('/email-verification');
      }
    }
  }, [user, navigate]);

  const handleAuthSuccess = (isRegistration = false) => {
    if (isRegistration) {
      // After registration, redirect to email verification
      navigate('/email-verification');
    } else {
      // After login, redirect based on email confirmation status
      // This will be handled by the useEffect above
    }
  };

  return (
    <AuthLayout>
      {/* Custom Tab Navigation */}
      <div className="w-full mb-8">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
          <button
            onClick={() => setActiveTab('login')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'login'
                ? 'bg-background text-foreground shadow-sm'
                : ''
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'register'
                ? 'bg-background text-foreground shadow-sm'
                : ''
            }`}
          >
            Registrieren
          </button>
        </div>
      </div>

      {/* Forms */}
      {activeTab === 'login' && (
        <LoginForm onSuccess={() => handleAuthSuccess(false)} />
      )}

      {activeTab === 'register' && (
        <RegisterForm onSuccess={() => handleAuthSuccess(true)} />
      )}
    </AuthLayout>
  );
};

export default Auth;
