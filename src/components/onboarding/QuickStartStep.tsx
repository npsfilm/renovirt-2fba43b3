
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
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="shrink-0 text-center mb-4 lg:mb-6">
        <div className="w-12 h-12 lg:w-20 lg:h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-6">
          <CheckCircle className="w-6 h-6 lg:w-10 lg:h-10 text-success" />
        </div>
        <h2 className="text-lg lg:text-2xl xl:text-3xl font-bold text-foreground mb-2 lg:mb-3">Perfekt! Sie sind startklar.</h2>
        <p className="text-sm lg:text-base text-muted-foreground">
          Ihr RenovIrt-Konto wurde erfolgreich eingerichtet. Was möchten Sie als Nächstes tun?
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 lg:space-y-4">
          <button
            onClick={handleStartUploading}
            disabled={loading}
            className="w-full p-3 lg:p-4 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-left group"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-primary rounded-lg flex items-center justify-center text-primary-foreground group-hover:scale-105 transition-transform shrink-0">
                <Upload className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm lg:text-lg mb-1 lg:mb-2">📁 Erste Fotos hochladen</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">Starten Sie sofort mit Ihrem ersten Projekt und erleben Sie unsere professionelle Bildbearbeitung</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleViewExamples}
            disabled={loading}
            className="w-full p-3 lg:p-4 rounded-lg border-2 border-border hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shrink-0">
                <Eye className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm lg:text-lg mb-1 lg:mb-2">👀 Beispiele ansehen</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">Entdecken Sie Beispiele unserer Arbeit und erfahren Sie mehr über unsere Bearbeitungsmöglichkeiten</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleVisitHelp}
            disabled={loading}
            className="w-full p-3 lg:p-4 rounded-lg border-2 border-border hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
          >
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-muted rounded-lg flex items-center justify-center text-muted-foreground shrink-0">
                <HelpCircle className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm lg:text-lg mb-1 lg:mb-2">🧠 Hilfe-Center besuchen</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">Finden Sie Antworten auf häufige Fragen und erhalten Sie Tipps für die beste Bildqualität</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="shrink-0 flex justify-between pt-4 lg:pt-6">
        <Button variant="outline" onClick={prevStep} disabled={loading} size="sm" className="text-sm">
          Zurück
        </Button>
        <Button 
          onClick={handleStartUploading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
          disabled={loading}
          size="sm"
        >
          {loading ? 'Wird eingerichtet...' : 'Zum Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default QuickStartStep;
