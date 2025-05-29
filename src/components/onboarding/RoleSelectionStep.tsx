
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, Camera, Users } from 'lucide-react';
import { OnboardingData } from '@/pages/Onboarding';

interface RoleSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
}

const roles = [
  {
    id: 'makler',
    icon: Building,
    title: 'Makler',
    description: 'Immobilienvermarktung und Verkauf',
    benefits: ['Verkaufsfördernde Bilder', 'Schnelle Bearbeitung', 'Professional Präsentation']
  },
  {
    id: 'architekt',
    icon: Users,
    title: 'Architekt',
    description: 'Architekturvisualisierung',
    benefits: ['Projektpräsentation', 'Designvisualisierung', 'Portfolio-Optimierung']
  },
  {
    id: 'fotograf',
    icon: Camera,
    title: 'Fotograf',
    description: 'Immobilienfotografie',
    benefits: ['Workflow-Optimierung', 'Batch-Bearbeitung', 'Konsistente Qualität']
  }
];

const RoleSelectionStep = ({ data, updateData, nextStep, prevStep }: RoleSelectionStepProps) => {
  const selectRole = (roleId: string) => {
    updateData({ role: roleId });
    setTimeout(nextStep, 300);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Was beschreibt Sie am besten?</h2>
        <p className="text-lg text-gray-600">
          Wählen Sie Ihre Rolle, damit wir Ihnen die besten Features empfehlen können.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = data.role === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => selectRole(role.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 mb-4">{role.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {role.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isSelected
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Zurück
        </Button>
        <Button onClick={nextStep} disabled={!data.role}>
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
