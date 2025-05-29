
import React from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';

interface DataSourceStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
}

const dataSources = [
  { id: 'google', title: 'Google Suche', icon: '🔍' },
  { id: 'ads', title: 'Online-Werbung (Ads)', icon: '📱' },
  { id: 'empfehlung', title: 'Empfehlung', icon: '👥' },
  { id: 'flyer', title: 'Flyer/Print', icon: '📄' },
  { id: 'partner', title: 'Partner/Kooperation', icon: '🤝' },
  { id: 'social', title: 'Social Media', icon: '📲' },
  { id: 'messe', title: 'Messe/Event', icon: '🏢' },
  { id: 'andere', title: 'Anderes', icon: '❓' }
];

const DataSourceStep = ({ data, updateData, nextStep, prevStep }: DataSourceStepProps) => {
  const selectDataSource = (sourceId: string) => {
    updateData({ dataSource: sourceId });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Wie sind Sie auf uns aufmerksam geworden?</h2>
        <p className="text-lg text-gray-600">
          Helfen Sie uns dabei, unsere Services zu verbessern.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dataSources.map((source) => {
          const isSelected = data.dataSource === source.id;
          
          return (
            <button
              key={source.id}
              onClick={() => selectDataSource(source.id)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">{source.icon}</div>
              <div className={`text-sm font-medium ${
                isSelected ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {source.title}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Zurück
        </Button>
        <Button onClick={nextStep} disabled={!data.dataSource}>
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;
