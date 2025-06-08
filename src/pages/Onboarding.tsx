import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { validateUrlTokens, secureLog, logSecurityEvent } from '@/utils/authSecurity';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import RoleSelectionStep from '@/components/onboarding/RoleSelectionStep';
import CompanyDataStep from '@/components/onboarding/CompanyDataStep';
import SourceStep from '@/components/onboarding/SourceStep';
import QuickStartStep from '@/components/onboarding/QuickStartStep';
import EmailConfirmationHandler from '@/components/onboarding/EmailConfirmationHandler';

export interface OnboardingData {
  role: string;
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address: string;
  vatId: string;
  source: string;
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
    phone: '',
    address: '',
    vatId: '',
    source: '',
  });

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { saveCustomerProfile, loading } = useCustomerProfile();

  // Handle email confirmation on page load
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      const search = window.location.search;
      
      if (hash || search) {
        setIsConfirmingEmail(true);
        secureLog('Email confirmation detected on onboarding page');
        
        try {
          const hashTokens = validateUrlTokens(hash);
          const searchParams = new URLSearchParams(search);
          const accessToken = hashTokens?.accessToken || searchParams.get('access_token');
          const refreshToken = searchParams.get('refresh_token');
          const type = hashTokens?.type || searchParams.get('type');
          
          if (accessToken && (type === 'signup' || type === 'email_confirmation')) {
            secureLog('Processing email confirmation with access token');
            logSecurityEvent('email_confirmation_processing', { type });
            
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
              
              window.history.replaceState({}, document.title, window.location.pathname);
              
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

  useEffect(() => {
    if (!authLoading && !user && !isConfirmingEmail) {
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, authLoading, isConfirmingEmail, navigate]);

  const steps = [
    { component: WelcomeStep, title: 'Willkommen' },
    { component: RoleSelectionStep, title: 'Rolle auswählen' },
    { component: CompanyDataStep, title: 'Unternehmensdaten' },
    { component: SourceStep, title: 'Wie haben Sie uns gefunden?' },
    { component: QuickStartStep, title: 'Schnellstart' },
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
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }
      
      if (!user) {
        console.error('User not authenticated, redirecting to auth');
        navigate('/auth');
        return;
      }
      
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
        phone: onboardingData.phone,
        address: onboardingData.address,
        vatId: onboardingData.vatId,
        dataSource: onboardingData.source,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (isConfirmingEmail) {
    return <EmailConfirmationHandler error={confirmationError} />;
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Account Registration</h1>
          </div>
          <div className="text-sm text-gray-500">
            Deutsch
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Progress */}
          <div className="w-80 bg-white rounded-lg p-6 h-fit">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index < currentStep 
                      ? 'bg-orange-500 border-orange-500 text-white' 
                      : index === currentStep
                      ? 'border-orange-500 text-orange-500 bg-orange-50'
                      : 'border-gray-300 text-gray-400 bg-gray-50'
                  }`}>
                    {index < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : index === currentStep ? (
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium transition-colors ${
                      index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    {index === 0 && <p className="text-xs text-gray-500 mt-1">Provide your personal details</p>}
                    {index === 1 && <p className="text-xs text-gray-500 mt-1">Provide your identification details</p>}
                    {index === 2 && <p className="text-xs text-gray-500 mt-1">Provide your business details</p>}
                    {index === 3 && <p className="text-xs text-gray-500 mt-1">How did you find us?</p>}
                    {index === 4 && <p className="text-xs text-gray-500 mt-1">Get up and running in 1 minute</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Aufträge verwendet und nicht an Dritte weitergegeben.</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-8 min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentStepComponent
                    data={onboardingData}
                    updateData={updateData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    completeOnboarding={completeOnboarding}
                    loading={loading}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Back to login */}
        <div className="mt-6">
          <button 
            onClick={() => navigate('/auth')} 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
