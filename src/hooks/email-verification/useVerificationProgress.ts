
import { EmailStatus } from './useEmailVerificationStatus';

export interface VerificationStep {
  key: string;
  label: string;
  completed: boolean;
}

export const useVerificationProgress = () => {
  const getVerificationProgress = (emailStatus: EmailStatus) => {
    const steps: VerificationStep[] = [
      { key: 'registration', label: 'Registrierung', completed: true },
      { key: 'email_sent', label: 'E-Mail gesendet', completed: emailStatus !== 'idle' },
      { key: 'email_delivered', label: 'E-Mail zugestellt', completed: ['delivered', 'clicked', 'verified'].includes(emailStatus) },
      { key: 'link_clicked', label: 'Link geklickt', completed: ['clicked', 'verified'].includes(emailStatus) },
      { key: 'verified', label: 'Bestätigt', completed: emailStatus === 'verified' }
    ];
    
    const completedSteps = steps.filter(step => step.completed).length;
    const progressPercentage = (completedSteps / steps.length) * 100;
    
    return { steps, progressPercentage };
  };

  return {
    getVerificationProgress
  };
};
