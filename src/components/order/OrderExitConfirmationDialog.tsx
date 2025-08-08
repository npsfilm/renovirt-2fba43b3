import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface OrderExitConfirmationDialogProps {
  open: boolean;
  onContinue: () => void;
  onExit: () => void;
}

export const OrderExitConfirmationDialog: React.FC<OrderExitConfirmationDialogProps> = ({
  open,
  onContinue,
  onExit,
}) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Bestellung verlassen?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Ihre Fortschritte gehen verloren, wenn Sie die Bestellung jetzt verlassen. 
            Alle hochgeladenen Dateien und Einstellungen müssen neu eingegeben werden.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onExit}
            className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Bestellung verlassen
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Weiter bearbeiten
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};