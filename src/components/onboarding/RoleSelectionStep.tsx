
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
    <div className="flex flex-col max-w-5xl mx-auto min-h-0 h-full">
      {/* Header */}
      <div className="shrink-0 mb-6 lg:mb-10">
        <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-3 lg:mb-4">Welche Rolle beschreibt Sie am besten?</h2>
        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
          Wählen Sie Ihre Rolle, damit wir Ihnen die besten Features empfehlen können.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-4 lg:space-y-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = data.role === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => selectRole(role.id)}
                className={`w-full p-5 lg:p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg group ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                    : 'border-border hover:border-primary/50 bg-card hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4 lg:space-x-6">
                  <div className={`p-3 lg:p-4 rounded-xl shrink-0 transition-all duration-300 ${
                    isSelected ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground group-hover:bg-primary/10'
                  }`}>
                    <Icon className="w-5 h-5 lg:w-7 lg:h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-xl font-bold text-foreground mb-2 lg:mb-3">{role.title}</h3>
                    <p className="text-sm lg:text-base text-muted-foreground mb-3 lg:mb-4 leading-relaxed">{role.description}</p>
                    <div className="flex flex-wrap gap-2 lg:gap-3">
                      {role.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 ${
                            isSelected
                              ? 'bg-primary/10 text-primary shadow-sm'
                              : 'bg-muted text-muted-foreground group-hover:bg-primary/5'
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
            className={`w-full p-5 lg:p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg group ${
              showOther
                ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                : 'border-border hover:border-primary/50 bg-card hover:shadow-md'
            }`}
          >
            <div className="flex items-start space-x-4 lg:space-x-6">
              <div className={`p-3 lg:p-4 rounded-xl shrink-0 transition-all duration-300 ${
                showOther ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground group-hover:bg-primary/10'
              }`}>
                <svg className="w-5 h-5 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base lg:text-xl font-bold text-foreground mb-2 lg:mb-3">Sonstiges</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">Andere Rolle (bitte angeben)</p>
              </div>
            </div>
          </button>

          {showOther && (
            <div className="ml-12 lg:ml-16 space-y-4 animate-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                placeholder="Bitte geben Sie Ihre Rolle an..."
                className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground text-base shadow-sm transition-all duration-200"
                autoFocus
              />
              <Button
                onClick={handleOtherSubmit}
                disabled={!otherRole.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                size="sm"
              >
                Weiter
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="shrink-0 flex justify-between pt-6 lg:pt-10">
        <Button variant="outline" onClick={prevStep} size="sm" className="text-sm rounded-xl px-6 py-2.5 border-2 hover:shadow-md transition-all duration-200">
          Zurück
        </Button>
        <Button onClick={nextStep} disabled={!data.role} size="sm" className="text-sm rounded-xl px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-300">
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
