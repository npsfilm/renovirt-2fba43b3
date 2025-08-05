
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
      <div className="shrink-0 mb-6 lg:mb-10">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="w-12 h-12 lg:w-20 lg:h-20 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Camera className="w-6 h-6 lg:w-10 lg:h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-2 lg:mb-3">Willkommen bei RenovIrt!</h1>
            <p className="text-base lg:text-xl text-muted-foreground leading-relaxed">Professionelle Immobilienfotografie - einfach, schnell, zuverlässig</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col space-y-6 lg:space-y-10 overflow-y-auto min-h-0">
        {/* Main Value Proposition */}
        <div className="bg-primary/5 rounded-2xl p-6 lg:p-8 border border-primary/20 shadow-lg">
          <div className="flex items-start gap-4 lg:gap-6">
            <div className="w-10 h-10 lg:w-16 lg:h-16 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-5 h-5 lg:w-8 lg:h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg lg:text-2xl font-bold text-foreground mb-3 lg:mb-4">Ihre Immobilienfotos in 48 Stunden</h2>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-3 lg:mb-6">
                Wir bearbeiten Ihre Immobilienfotos professionell und effizient – 
                <span className="font-semibold text-foreground"> in nur 48 Stunden, Made in Germany</span>.
              </p>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                Lassen Sie uns Sie in wenigen Schritten kennenlernen, damit wir unseren Service optimal auf Ihre Bedürfnisse abstimmen können.
              </p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="text-center p-5 lg:p-6 bg-card border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 lg:w-16 lg:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-sm">
              <svg className="w-5 h-5 lg:w-8 lg:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-base lg:text-lg font-bold text-foreground mb-2 lg:mb-3">1. Ihre Rolle</h3>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">Teilen Sie uns mit, in welcher Rolle Sie tätig sind</p>
          </div>
          
          <div className="text-center p-5 lg:p-6 bg-card border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 lg:w-16 lg:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-sm">
              <Building className="w-5 h-5 lg:w-8 lg:h-8 text-primary" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-foreground mb-2 lg:mb-3">2. Ihre Daten</h3>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">Persönliche und Firmendaten für rechtssichere Abrechnung</p>
          </div>
          
          <div className="text-center p-5 lg:p-6 bg-card border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="w-10 h-10 lg:w-16 lg:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-sm">
              <svg className="w-5 h-5 lg:w-8 lg:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base lg:text-lg font-bold text-foreground mb-2 lg:mb-3">3. Sofort starten</h3>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">Laden Sie Ihre ersten Fotos hoch und erleben Sie unsere Qualität</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 pt-6 lg:pt-10">
        <Button 
          onClick={nextStep} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 lg:px-12 py-3 lg:py-4 text-base lg:text-lg font-semibold w-full lg:w-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          Jetzt starten
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
