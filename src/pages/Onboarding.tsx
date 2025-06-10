
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
  street: string;
  city: string;
  postalCode: string;
  country: string;
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
    street: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
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
    // Don't redirect if we're confirming email
    if (!authLoading && !user && !isConfirmingEmail) {
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, authLoading, isConfirmingEmail, navigate]);

  const steps = [
    { component: WelcomeStep, title: 'Willkommen' },
    { component: RoleSelectionStep, title: 'Ihre Rolle' },
    { component: CompanyDataStep, title: 'Ihre Daten' },
    { component: SourceStep, title: 'Wie haben Sie uns gefunden?' },
    { component: QuickStartStep, title: 'Schnellstart' },
  ];

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
      
      // Combine address fields for storage
      const address = `${onboardingData.street}, ${onboardingData.city}, ${onboardingData.postalCode}, ${onboardingData.country}`;
      
      await saveCustomerProfile({
        role: onboardingData.role,
        salutation: onboardingData.salutation,
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        company: onboardingData.company,
        phone: onboardingData.phone,
        address: address,
        vatId: onboardingData.vatId,
        dataSource: onboardingData.source,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lädt...</p>
        </div>
      </div>
    );
  }

  // Show email confirmation handler if confirming
  if (isConfirmingEmail) {
    return <EmailConfirmationHandler error={confirmationError} />;
  }

  // If no user and not loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Willkommen bei RenovIrt</h1>
            <p className="text-muted-foreground mt-1">Richten Sie Ihr Konto in wenigen Schritten ein</p>
          </div>
          <div className="text-sm text-muted-foreground bg-card px-3 py-1 rounded-full border">
            Schritt {currentStep + 1} von {steps.length}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Progress */}
          <div className="w-80 bg-card rounded-lg border p-6 h-fit">
            <h2 className="text-lg font-semibold text-foreground mb-6">Einrichtungsfortschritt</h2>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    index < currentStep 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : index === currentStep
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-muted text-muted-foreground bg-muted/50'
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
                    {index === 0 && <p className="text-xs text-muted-foreground mt-1">Erfahren Sie mehr über RenovIrt</p>}
                    {index === 1 && <p className="text-xs text-muted-foreground mt-1">Wählen Sie Ihre berufliche Rolle</p>}
                    {index === 2 && <p className="text-xs text-muted-foreground mt-1">Ihre persönlichen & Firmendaten</p>}
                    {index === 3 && <p className="text-xs text-muted-foreground mt-1">Helfen Sie uns, besser zu werden</p>}
                    {index === 4 && <p className="text-xs text-muted-foreground mt-1">Starten Sie Ihr erstes Projekt</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-start space-x-3 text-xs text-muted-foreground">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="font-medium text-foreground mb-1">Datenschutz & Sicherheit</p>
                  <p>Ihre Daten werden DSGVO-konform verarbeitet und ausschließlich zur Auftragsbearbeitung verwendet. Keine Weitergabe an Dritte.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-card rounded-lg border p-8 min-h-[600px]">
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
        <div className="mt-8">
          <button 
            onClick={() => navigate('/auth')} 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
