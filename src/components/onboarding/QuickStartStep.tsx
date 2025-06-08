
import React from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';

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
  const handleStartUploading = () => {
    completeOnboarding();
  };

  return (
    <div className="max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ Perfekt – Sie sind startklar!</h2>
        <p className="text-gray-600">
          Was möchten Sie als Nächstes tun?
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button
          onClick={handleStartUploading}
          disabled={loading}
          className="w-full p-6 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 transition-all text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white group-hover:bg-orange-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">📁 Jetzt Immobilienfotos hochladen</h3>
              <p className="text-gray-600">Laden Sie Ihre ersten Bilder hoch und lassen Sie sie professionell bearbeiten</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleStartUploading}
          disabled={loading}
          className="w-full p-6 rounded-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">👀 Beispiele ansehen / Demo ansehen</h3>
              <p className="text-gray-600">Sehen Sie sich Beispiele unserer Arbeit an</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleStartUploading}
          disabled={loading}
          className="w-full p-6 rounded-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">🧠 Fragen? → Hilfe-Center</h3>
              <p className="text-gray-600">Besuchen Sie unser Hilfe-Center für häufige Fragen</p>
            </div>
          </div>
        </button>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Ihre Daten im Überblick:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Rolle:</span>
            <span className="ml-2 font-medium">{data.role}</span>
          </div>
          <div>
            <span className="text-gray-600">Name:</span>
            <span className="ml-2 font-medium">{data.firstName} {data.lastName}</span>
          </div>
          {data.company && (
            <div>
              <span className="text-gray-600">Firma:</span>
              <span className="ml-2 font-medium">{data.company}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600">Quelle:</span>
            <span className="ml-2 font-medium">{data.source}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={loading}>
          Zurück
        </Button>
        <Button 
          onClick={handleStartUploading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8"
          disabled={loading}
        >
          {loading ? 'Wird eingerichtet...' : 'Zum Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default QuickStartStep;
