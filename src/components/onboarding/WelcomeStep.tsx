
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
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mr-6">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Willkommen bei RenovIrt!</h1>
            <p className="text-lg text-muted-foreground">Professionelle Immobilienfotografie - einfach, schnell, zuverlässig</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Ihre Immobilienfotos in 48 Stunden</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Wir bearbeiten Ihre Immobilienfotos professionell und effizient – 
                <span className="font-semibold text-foreground"> in nur 48 Stunden, Made in Germany</span>.
              </p>
              <p className="text-muted-foreground">
                Lassen Sie uns Sie in wenigen Schritten kennenlernen, damit wir unseren Service optimal auf Ihre Bedürfnisse abstimmen können.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-card border rounded-lg hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">1. Ihre Rolle</h3>
            <p className="text-sm text-muted-foreground">Teilen Sie uns mit, in welcher Rolle Sie tätig sind, um maßgeschneiderte Empfehlungen zu erhalten</p>
          </div>
          
          <div className="text-center p-6 bg-card border rounded-lg hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">2. Ihre Daten</h3>
            <p className="text-sm text-muted-foreground">Angabe Ihrer persönlichen und Firmendaten für eine rechtssichere Abrechnung</p>
          </div>
          
          <div className="text-center p-6 bg-card border rounded-lg hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">3. Sofort starten</h3>
            <p className="text-sm text-muted-foreground">Laden Sie Ihre ersten Immobilienfotos hoch und erleben Sie unsere Qualität</p>
          </div>
        </div>

        <div className="pt-8">
          <Button 
            onClick={nextStep} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 text-lg font-medium"
            size="lg"
          >
            Jetzt starten
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
