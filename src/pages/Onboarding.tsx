
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
import EmailConfirmationHandler from '@/components/onboarding/EmailConfirmationHandler';
import UnifiedLoading from '@/components/ui/unified-loading';

export interface OnboardingData {
  role: string;
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address: string;
  vatId: string;
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
  });

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { saveCustomerProfile, loading } = useCustomerProfile();

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
      navigate('/auth');
    }
  }, [user, authLoading, isConfirmingEmail, navigate]);

  // Vereinfachtes 3-Schritt Onboarding
  const steps = [
    { component: WelcomeStep, title: 'Willkommen' },
    { component: RoleSelectionStep, title: 'Rolle & Daten' },
    { component: CompanyDataStep, title: 'Unternehmen' },
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
      if (authLoading) {
        return;
      }
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate('/auth');
        return;
      }
      
      await saveCustomerProfile({
        role: onboardingData.role,
        salutation: onboardingData.salutation,
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        company: onboardingData.company,
        phone: onboardingData.phone,
        address: onboardingData.address,
        vatId: onboardingData.vatId,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <UnifiedLoading 
          size="xl" 
          text="Laden..." 
          variant="with-background"
        />
      </div>
    );
  }

  if (isConfirmingEmail) {
    return <EmailConfirmationHandler error={confirmationError} />;
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Konto einrichten</h1>
            <p className="text-muted-foreground">Lassen Sie uns Ihr Profil vervollständigen</p>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-80 bg-background rounded-lg p-6 h-fit shadow-sm border">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index < currentStep 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : index === currentStep
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-border text-muted-foreground bg-muted/50'
                  }`}>
                    {index < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : index === currentStep ? (
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium transition-colors ${
                      index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {Math.round(progress)}% abgeschlossen
              </p>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-background rounded-lg p-8 min-h-[600px] shadow-sm border">
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

        <div className="mt-6">
          <button 
            onClick={() => navigate('/auth')} 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zur Anmeldung
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
