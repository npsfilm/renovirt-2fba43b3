
import React from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingData } from '@/pages/Onboarding';

interface ResponsibilityStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
}

const responsibilities = [
  {
    id: 'inhaber',
    title: 'Inhaber/Geschäftsführer',
    description: 'Entscheidungsbefugnis für Unternehmensausgaben'
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Verantwortlich für Marketingmaßnahmen und Werbung'
  },
  {
    id: 'vertrieb',
    title: 'Vertrieb',
    description: 'Kundenbetreuung und Verkaufsaktivitäten'
  },
  {
    id: 'assistenz',
    title: 'Assistenz',
    description: 'Administrative Unterstützung und Organisation'
  }
];

const ResponsibilityStep = ({ data, updateData, nextStep, prevStep }: ResponsibilityStepProps) => {
  const selectResponsibility = (responsibilityId: string) => {
    updateData({ responsibility: responsibilityId });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Ihre Zuständigkeit</h2>
        <p className="text-gray-600">
          Welche Position beschreibt Ihre Rolle im Unternehmen am besten?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {responsibilities.map((responsibility) => {
          const isSelected = data.responsibility === responsibility.id;
          
          return (
            <button
              key={responsibility.id}
              onClick={() => selectResponsibility(responsibility.id)}
              className={`p-6 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className={`font-semibold mb-2 text-lg ${
                isSelected ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {responsibility.title}
              </h3>
              <p className={`text-sm ${
                isSelected ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {responsibility.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Zurück
        </Button>
        <Button onClick={nextStep} disabled={!data.responsibility}>
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default ResponsibilityStep;
