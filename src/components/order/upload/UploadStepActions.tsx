
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UploadStepActionsProps {
  onPrev: () => void;
  onNext: () => void;
  canProceed: boolean;
  fileCount: number;
}

const UploadStepActions = ({ onPrev, onNext, canProceed, fileCount }: UploadStepActionsProps) => {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-border">
      <Button 
        variant="outline" 
        onClick={onPrev} 
        className="group bg-background hover:bg-muted shadow-sm transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        Zurück zum Typ
      </Button>
      
      <div className="flex items-center gap-4">
        {fileCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {fileCount} {fileCount === 1 ? 'Datei' : 'Dateien'} hochgeladen
          </div>
        )}
        
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          size="lg"
          className="group min-w-[180px] shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
        >
          Weiter zum Paket
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </div>
  );
};

export default UploadStepActions;
