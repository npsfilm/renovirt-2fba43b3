
import React from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';
import { Camera, Building, Zap } from 'lucide-react';

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
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="shrink-0 mb-4 lg:mb-6">
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="w-10 h-10 lg:w-16 lg:h-16 bg-primary/10 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 lg:w-8 lg:h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-lg lg:text-2xl xl:text-3xl font-bold text-foreground mb-1 lg:mb-2">Willkommen bei RenovIrt!</h1>
            <p className="text-sm lg:text-lg text-muted-foreground">Professionelle Immobilienfotografie - einfach, schnell, zuverlässig</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 overflow-y-auto">
        {/* Main Value Proposition */}
        <div className="bg-primary/5 rounded-lg lg:rounded-xl p-4 lg:p-6 border border-primary/20">
          <div className="flex items-start gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 lg:w-6 lg:h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-base lg:text-xl font-semibold text-foreground mb-2 lg:mb-3">Ihre Immobilienfotos in 48 Stunden</h2>
              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-2 lg:mb-4">
                Wir bearbeiten Ihre Immobilienfotos professionell und effizient – 
                <span className="font-semibold text-foreground"> in nur 48 Stunden, Made in Germany</span>.
              </p>
              <p className="text-sm lg:text-base text-muted-foreground">
                Lassen Sie uns Sie in wenigen Schritten kennenlernen, damit wir unseren Service optimal auf Ihre Bedürfnisse abstimmen können.
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <div className="text-center p-3 lg:p-4 bg-card border rounded-lg">
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <svg className="w-4 h-4 lg:w-6 lg:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-foreground mb-1 lg:mb-2">1. Ihre Rolle</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">Teilen Sie uns mit, in welcher Rolle Sie tätig sind</p>
          </div>
          
          <div className="text-center p-3 lg:p-4 bg-card border rounded-lg">
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <Building className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-foreground mb-1 lg:mb-2">2. Ihre Daten</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">Persönliche und Firmendaten für rechtssichere Abrechnung</p>
          </div>
          
          <div className="text-center p-3 lg:p-4 bg-card border rounded-lg">
            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 lg:mb-3">
              <svg className="w-4 h-4 lg:w-6 lg:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm lg:text-base font-semibold text-foreground mb-1 lg:mb-2">3. Sofort starten</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">Laden Sie Ihre ersten Fotos hoch und erleben Sie unsere Qualität</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 pt-4 lg:pt-6">
        <Button 
          onClick={nextStep} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 lg:px-10 py-2 lg:py-3 text-sm lg:text-lg font-medium w-full lg:w-auto"
          size="lg"
        >
          Jetzt starten
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
