
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
    <div className="flex flex-col max-w-5xl mx-auto min-h-0 h-full">
      {/* Header Section */}
      <div className="shrink-0 mb-2 lg:mb-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Camera className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-base lg:text-xl xl:text-2xl font-bold text-foreground mb-1">Willkommen bei RenovIrt!</h1>
            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">Professionelle Immobilienfotografie - einfach, schnell, zuverlässig</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col space-y-3 lg:space-y-4 overflow-y-auto min-h-0">
        {/* Main Value Proposition */}
        <div className="bg-primary/5 rounded-xl p-3 lg:p-4 border border-primary/20 shadow-lg">
          <div className="flex items-start gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm lg:text-base font-bold text-foreground mb-1 lg:mb-2">Ihre Immobilienfotos in 48 Stunden</h2>
              <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed mb-1 lg:mb-2">
                Wir bearbeiten Ihre Immobilienfotos professionell und effizient – 
                <span className="font-semibold text-foreground"> in nur 48 Stunden, Made in Germany</span>.
              </p>
              <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                Lassen Sie uns Sie in wenigen Schritten kennenlernen, damit wir unseren Service optimal auf Ihre Bedürfnisse abstimmen können.
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
          <div className="text-center p-3 lg:p-4 bg-card border rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-foreground mb-1">1. Ihre Rolle</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Teilen Sie uns mit, in welcher Rolle Sie tätig sind</p>
          </div>
          
          <div className="text-center p-3 lg:p-4 bg-card border rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Building className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-foreground mb-1">2. Ihre Daten</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Persönliche und Firmendaten für rechtssichere Abrechnung</p>
          </div>
          
          <div className="text-center p-3 lg:p-4 bg-card border rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xs lg:text-sm font-bold text-foreground mb-1">3. Sofort starten</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Laden Sie Ihre ersten Fotos hoch und erleben Sie unsere Qualität</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 pt-3 lg:pt-4">
        <Button 
          onClick={nextStep} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base font-semibold w-full lg:w-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          size="sm"
        >
          Jetzt starten
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
