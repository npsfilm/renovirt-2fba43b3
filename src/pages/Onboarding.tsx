
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import RoleSelectionStep from '@/components/onboarding/RoleSelectionStep';
import ProfileDataStep from '@/components/onboarding/ProfileDataStep';
import ResponsibilityStep from '@/components/onboarding/ResponsibilityStep';
import DataSourceStep from '@/components/onboarding/DataSourceStep';
import QuickStartStep from '@/components/onboarding/QuickStartStep';
import CompletionStep from '@/components/onboarding/CompletionStep';

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
  const { user } = useAuth();

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

  const completeOnboarding = () => {
    // TODO: Save onboarding data to database
    console.log('Onboarding completed:', onboardingData);
    navigate('/');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-blue-700 p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Renovirt</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Ihr Profil einrichten</h2>
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-blue-200">{Math.round(progress)}% abgeschlossen</p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep ? 'bg-green-500 text-white' :
                  index === currentStep ? 'bg-white text-blue-700' :
                  'bg-blue-600 text-blue-300'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className={`text-sm ${
                  index <= currentStep ? 'text-white' : 'text-blue-300'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-20">
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-400 rounded-full transform translate-y-10 -translate-x-10"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-400 rounded-full transform translate-y-8 translate-x-8"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
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
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
