
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, Mail, MousePointer, Shield } from 'lucide-react';

interface VerificationStep {
  key: string;
  label: string;
  completed: boolean;
}

interface VerificationProgressProps {
  steps: VerificationStep[];
  progressPercentage: number;
}

const VerificationProgress = ({ steps, progressPercentage }: VerificationProgressProps) => {
  const getStepIcon = (step: VerificationStep, index: number) => {
    const IconComponent = [Mail, Mail, MousePointer, MousePointer, Shield][index];
    
    if (step.completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (index === steps.findIndex(s => !s.completed)) {
      return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
    } else {
      return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Bestätigungsfortschritt</h3>
        <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-3">
            {getStepIcon(step, index)}
            <span className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationProgress;
