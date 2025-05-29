
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { validateUrlTokens, secureLog, logSecurityEvent } from '@/utils/authSecurity';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import RoleSelectionStep from '@/components/onboarding/RoleSelectionStep';
import ProfileDataStep from '@/components/onboarding/ProfileDataStep';
import ResponsibilityStep from '@/components/onboarding/ResponsibilityStep';
import DataSourceStep from '@/components/onboarding/DataSourceStep';
import QuickStartStep from '@/components/onboarding/QuickStartStep';
import CompletionStep from '@/components/onboarding/CompletionStep';
import EmailConfirmationHandler from '@/components/onboarding/EmailConfirmationHandler';

export interface OnboardingData {
  role: string;
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  phone: string;
  industry: string;
  responsibility: string;
  dataSource: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmingEmail, setIsConfirmingEmail] = useState(false);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    role: '',
    salutation: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    phone: '',
    industry: '',
    responsibility: '',
    dataSource: '',
  });

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { saveCustomerProfile, loading } = useCustomerProfile();

  // Handle email confirmation on page load
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Check URL hash for tokens (email confirmation links use hash)
      const hash = window.location.hash;
      // Also check search params as a fallback
      const search = window.location.search;
      
      if (hash || search) {
        setIsConfirmingEmail(true);
        secureLog('Email confirmation detected on onboarding page');
        
        try {
          // Extract tokens from URL
          const hashTokens = validateUrlTokens(hash);
          const searchParams = new URLSearchParams(search);
          const accessToken = hashTokens?.accessToken || searchParams.get('access_token');
          const refreshToken = searchParams.get('refresh_token');
          const type = hashTokens?.type || searchParams.get('type');
          
          if (accessToken && (type === 'signup' || type === 'email_confirmation')) {
            secureLog('Processing email confirmation with access token');
            logSecurityEvent('email_confirmation_processing', { type });
            
            // Set the session using the tokens from URL
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (error) {
              throw error;
            }
            
            if (data.session) {
              secureLog('Email confirmation successful, session established');
              logSecurityEvent('email_confirmation_success', { userId: data.session.user.id });
              
              // Clean up the URL for security
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Brief delay to ensure auth state updates
              setTimeout(() => {
                setIsConfirmingEmail(false);
              }, 1000);
            } else {
              throw new Error('Session could not be established');
            }
          } else {
            secureLog('No valid confirmation tokens found in URL');
            setIsConfirmingEmail(false);
          }
        } catch (error: any) {
          console.error('Error during email confirmation:', error);
          logSecurityEvent('email_confirmation_error', { error: error.message });
          setConfirmationError('Es gab ein Problem bei der E-Mail-Bestätigung. Bitte versuchen Sie es erneut.');
          setIsConfirmingEmail(false);
        }
      }
    };

    handleEmailConfirmation();
  }, []);

  // Redirect to auth if not authenticated and not loading
  useEffect(() => {
    if (!authLoading && !user && !isConfirmingEmail) {
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, authLoading, isConfirmingEmail, navigate]);

  const steps = [
    { component: WelcomeStep, title: 'Willkommen' },
    { component: RoleSelectionStep, title: 'Rollenwahl' },
    { component: ProfileDataStep, title: 'Profil & Unternehmensdaten' },
    { component: ResponsibilityStep, title: 'Zuständigkeit' },
    { component: DataSourceStep, title: 'Datenquelle' },
    { component: QuickStartStep, title: 'Quick Start' },
    { component: CompletionStep, title: 'Abschluss' },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = async () => {
    try {
      console.log('Completing onboarding with data:', onboardingData);
      console.log('Current user:', user);
      console.log('Auth loading:', authLoading);
      
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }
      
      // Check if user is authenticated before saving
      if (!user) {
        console.error('User not authenticated, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      // Verify we have a valid session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('No valid session found, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      console.log('Valid session found, proceeding with profile save');
      
      await saveCustomerProfile({
        role: onboardingData.role,
        salutation: onboardingData.salutation,
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        company: onboardingData.company,
        address: onboardingData.address,
        phone: onboardingData.phone,
        industry: onboardingData.industry,
        responsibility: onboardingData.responsibility,
        dataSource: onboardingData.dataSource,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  // Show email confirmation handler if we're processing confirmation
  if (isConfirmingEmail) {
    return <EmailConfirmationHandler error={confirmationError} />;
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Compact Progress */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">Renovirt</h1>
          <p className="text-sm text-gray-500 mt-1">Setup your profile</p>
        </div>
        
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs text-gray-500">{currentStep + 1} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  index < currentStep ? 'bg-green-500 text-white' :
                  index === currentStep ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className={`text-sm transition-colors ${
                  index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Need help? Contact support
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
            >
              {currentStep === steps.length - 1 ? (
                <CompletionStep
                  data={onboardingData}
                  updateData={updateData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  completeOnboarding={completeOnboarding}
                  loading={loading}
                />
              ) : (
                <CurrentStepComponent
                  data={onboardingData}
                  updateData={updateData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  currentStep={currentStep}
                  totalSteps={steps.length}
                  completeOnboarding={completeOnboarding}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
