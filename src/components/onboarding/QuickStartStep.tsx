
import React from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';
import { Upload, Eye, HelpCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickStartStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
  loading?: boolean;
}

const QuickStartStep = ({ data, prevStep, completeOnboarding, loading }: QuickStartStepProps) => {
  const navigate = useNavigate();

  const handleStartUploading = () => {
    completeOnboarding();
  };

  const handleViewExamples = () => {
    navigate('/examples');
  };

  const handleVisitHelp = () => {
    navigate('/help');
  };

  return (
    <div className="max-w-3xl">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3">Perfekt! Sie sind startklar.</h2>
        <p className="text-lg text-muted-foreground">
          Ihr RenovIrt-Konto wurde erfolgreich eingerichtet. Was möchten Sie als Nächstes tun?
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          onClick={handleStartUploading}
          disabled={loading}
          className="w-full p-6 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-xl mb-2">📁 Erste Fotos hochladen</h3>
              <p className="text-muted-foreground">Starten Sie sofort mit Ihrem ersten Projekt und erleben Sie unsere professionelle Bildbearbeitung</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleViewExamples}
          disabled={loading}
          className="w-full p-6 rounded-lg border-2 border-border hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              <Eye className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-xl mb-2">👀 Beispiele ansehen</h3>
              <p className="text-muted-foreground">Entdecken Sie Beispiele unserer Arbeit und erfahren Sie mehr über unsere Bearbeitungsmöglichkeiten</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleVisitHelp}
          disabled={loading}
          className="w-full p-6 rounded-lg border-2 border-border hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-xl mb-2">🧠 Hilfe-Center besuchen</h3>
              <p className="text-muted-foreground">Finden Sie Antworten auf häufige Fragen und erhalten Sie Tipps für die beste Bildqualität</p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={loading}>
          Zurück
        </Button>
        <Button 
          onClick={handleStartUploading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          disabled={loading}
        >
          {loading ? 'Wird eingerichtet...' : 'Zum Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default QuickStartStep;
