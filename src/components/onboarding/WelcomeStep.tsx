
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
  loading?: boolean;
}

const WelcomeStep = ({ nextStep }: WelcomeStepProps) => {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-2xl">👋</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Willkommen bei ImmoOnPoint!</h1>
            <p className="text-orange-600 font-medium">Please enter your personal details.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Wir helfen Ihnen, Ihre Immobilienfotos professionell & effizient bearbeiten zu lassen – 
            <span className="font-semibold text-gray-900"> in 48 h, made in Germany</span>.
          </p>
          <p className="text-gray-600">
            In 3 kurzen Schritten lernen wir Sie besser kennen, damit wir den Service auf Sie abstimmen können.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 text-sm">Rolle auswählen</h3>
            <p className="text-xs text-gray-500 mt-1">Welche Rolle beschreibt Sie?</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 text-sm">Unternehmensdaten</h3>
            <p className="text-xs text-gray-500 mt-1">Für rechtssichere Abrechnung</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 text-sm">Sofort loslegen</h3>
            <p className="text-xs text-gray-500 mt-1">Erste Fotos hochladen</p>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            onClick={nextStep} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium"
            size="lg"
          >
            Los geht's
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
