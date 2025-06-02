
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

  // Get the page the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    const checkUserProfileAndRedirect = async () => {
      if (user) {
        // If user is confirmed (email verified), check for profile completion
        if (user.email_confirmed_at) {
          try {
            const profile = await getCustomerProfile();
            
            // If profile exists and has required fields, go to originally requested page or dashboard
            if (profile && profile.first_name && profile.last_name && profile.role) {
              navigate(from, { replace: true });
            } else {
              // If profile doesn't exist or is incomplete, go to onboarding
              navigate('/onboarding');
            }
          } catch (error) {
            // If there's an error fetching profile, assume it doesn't exist
            navigate('/onboarding');
          }
        } else {
          // If user is not confirmed, show email verification screen
          navigate('/email-verification');
        }
      }
    };

    checkUserProfileAndRedirect();
  }, [user, navigate, getCustomerProfile, from]);

  const handleAuthSuccess = (isRegistration = false) => {
    if (isRegistration) {
      // After registration, redirect to email verification
      navigate('/email-verification');
    } else {
      // After login, redirect based on email confirmation status and profile completion
      // This will be handled by the useEffect above
    }
  };

  return (
    <AuthLayout>
      {/* Custom Tab Navigation */}
      <div className="w-full mb-8">
        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-800 p-1 text-gray-300 w-full">
          <button
            onClick={() => setActiveTab('login')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'login'
                ? 'bg-gray-950 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Anmelden
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'register'
                ? 'bg-gray-950 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
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
