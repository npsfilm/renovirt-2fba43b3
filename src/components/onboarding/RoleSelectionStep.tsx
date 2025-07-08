
import React, { useState } from 'react';
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
  const [otherRole, setOtherRole] = useState('');
  const [showOther, setShowOther] = useState(false);

  const selectRole = (roleId: string) => {
    updateData({ role: roleId });
    if (roleId !== 'other') {
      setShowOther(false);
      setTimeout(nextStep, 300);
    }
  };

  const handleOtherRole = () => {
    setShowOther(true);
    updateData({ role: 'other' });
  };

  const handleOtherSubmit = () => {
    if (otherRole.trim()) {
      updateData({ role: otherRole.trim() });
      nextStep();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="shrink-0 mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-2xl font-bold text-foreground mb-2">Welche Rolle beschreibt Sie am besten?</h2>
        <p className="text-sm lg:text-base text-muted-foreground">
          Wählen Sie Ihre Rolle, damit wir Ihnen die besten Features empfehlen können.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 lg:space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = data.role === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => selectRole(role.id)}
                className={`w-full p-3 lg:p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 bg-card'
                }`}
              >
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <div className={`p-2 lg:p-3 rounded-lg shrink-0 ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-4 h-4 lg:w-6 lg:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm lg:text-lg font-semibold text-foreground mb-1 lg:mb-2">{role.title}</h3>
                    <p className="text-xs lg:text-sm text-muted-foreground mb-2 lg:mb-3">{role.description}</p>
                    <div className="flex flex-wrap gap-1 lg:gap-2">
                      {role.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
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

          {/* Other option */}
          <button
            onClick={handleOtherRole}
            className={`w-full p-3 lg:p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
              showOther
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex items-start space-x-3 lg:space-x-4">
              <div className={`p-2 lg:p-3 rounded-lg shrink-0 ${
                showOther ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm lg:text-lg font-semibold text-foreground mb-1 lg:mb-2">Sonstiges</h3>
                <p className="text-xs lg:text-sm text-muted-foreground">Andere Rolle (bitte angeben)</p>
              </div>
            </div>
          </button>

          {showOther && (
            <div className="ml-8 lg:ml-12 space-y-3">
              <input
                type="text"
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                placeholder="Bitte geben Sie Ihre Rolle an..."
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground text-sm"
                autoFocus
              />
              <Button
                onClick={handleOtherSubmit}
                disabled={!otherRole.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                size="sm"
              >
                Weiter
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="shrink-0 flex justify-between pt-4 lg:pt-6">
        <Button variant="outline" onClick={prevStep} size="sm" className="text-sm">
          Zurück
        </Button>
        <Button onClick={nextStep} disabled={!data.role} size="sm" className="text-sm">
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
