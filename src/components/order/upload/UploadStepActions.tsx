
import React from 'react';
import { Button } from '@/components/ui/button';

interface UploadStepActionsProps {
  onPrev: () => void;
  onNext: () => void;
  canProceed: boolean;
}

const UploadStepActions = ({ onPrev, onNext, canProceed }: UploadStepActionsProps) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onPrev} className="shadow-sm">
        ← Zurück zum Typ
      </Button>
      <Button 
        onClick={onNext} 
        disabled={!canProceed}
        className="min-w-[150px] shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
      >
        Weiter zum Paket →
      </Button>
    </div>
  );
};

export default UploadStepActions;
