
import React from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';

interface WelcomeStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
}

const WelcomeStep = ({ nextStep }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Willkommen bei Renovirt!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Optimieren Sie Ihre Immobilienbilder in Minuten – ohne technisches Vorwissen.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-green-600 font-semibold">1</span>
          </div>
          <h3 className="font-medium">Upload</h3>
          <p className="text-sm text-gray-500">Bilder hochladen</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-green-600 font-semibold">2</span>
          </div>
          <h3 className="font-medium">KI-Bearbeitung</h3>
          <p className="text-sm text-gray-500">Automatische Optimierung</p>
        </div>
        <div className="space-y-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-green-600 font-semibold">3</span>
          </div>
          <h3 className="font-medium">Download</h3>
          <p className="text-sm text-gray-500">Perfekte Ergebnisse</p>
        </div>
      </div>

      <Button onClick={nextStep} size="lg" className="px-8">
        Los geht's
      </Button>
    </div>
  );
};

export default WelcomeStep;
