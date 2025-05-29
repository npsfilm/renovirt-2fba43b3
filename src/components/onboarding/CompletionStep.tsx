
import React from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';

interface CompletionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
  loading?: boolean;
}

const CompletionStep = ({ data, completeOnboarding, loading }: CompletionStepProps) => {
  const getRoleTitle = (role: string) => {
    const roles: { [key: string]: string } = {
      'makler': 'Makler',
      'architekt': 'Architekt',
      'fotograf': 'Fotograf'
    };
    return roles[role] || role;
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfekt! Ihr Profil ist bereit.</h2>
          <p className="text-lg text-gray-600">
            Willkommen im Dashboard, {data.firstName}!
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left max-w-md mx-auto">
        <h3 className="font-medium text-gray-900 mb-4">Ihre Angaben im Überblick:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Rolle:</span>
            <span className="font-medium">{getRoleTitle(data.role)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{data.firstName} {data.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Unternehmen:</span>
            <span className="font-medium">{data.company}</span>
          </div>
          {data.industry && (
            <div className="flex justify-between">
              <span className="text-gray-600">Branche:</span>
              <span className="font-medium">{data.industry}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Was Sie jetzt tun können:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">📸</span>
            </div>
            <h4 className="font-medium text-blue-900 mb-1">Bilder bearbeiten</h4>
            <p className="text-sm text-blue-700">Laden Sie Ihre ersten Immobilienbilder hoch</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">⚙️</span>
            </div>
            <h4 className="font-medium text-green-900 mb-1">Einstellungen</h4>
            <p className="text-sm text-green-700">Passen Sie Ihre Präferenzen an</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-lg">📊</span>
            </div>
            <h4 className="font-medium text-purple-900 mb-1">Dashboard</h4>
            <p className="text-sm text-purple-700">Verwalten Sie Ihre Projekte</p>
          </div>
        </div>
      </div>

      <Button 
        onClick={completeOnboarding} 
        size="lg" 
        className="px-8"
        disabled={loading}
      >
        {loading ? 'Speichere...' : 'Zum Dashboard'}
      </Button>
    </div>
  );
};

export default CompletionStep;
