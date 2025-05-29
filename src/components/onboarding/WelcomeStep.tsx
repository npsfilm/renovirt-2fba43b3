
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
      <div className="space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Willkommen bei Renovirt!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimieren Sie Ihre Immobilienbilder in Minuten – ohne technisches Vorwissen.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">So einfach geht's:</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-semibold text-sm">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Upload</h4>
              <p className="text-sm text-gray-600">Bilder hochladen</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-semibold text-sm">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">KI-Bearbeitung</h4>
              <p className="text-sm text-gray-600">Automatische Optimierung</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-semibold text-sm">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Download</h4>
              <p className="text-sm text-gray-600">Perfekte Ergebnisse</p>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={nextStep} size="lg" className="px-8">
        Los geht's
      </Button>
    </div>
  );
};

export default WelcomeStep;
