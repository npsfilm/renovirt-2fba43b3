
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, LifeBuoy } from 'lucide-react';

interface SupportMessageProps {
  onSendChatHistory: (userEmail: string) => void;
  onOpenContactForm: () => void;
}

const SupportMessage = ({ onSendChatHistory, onOpenContactForm }: SupportMessageProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setUserEmail(email);
    setIsValidEmail(validateEmail(email));
  };

  const handleSendChatHistory = () => {
    setEmailDialogOpen(true);
  };

  const handleConfirmSend = () => {
    if (isValidEmail && userEmail) {
      onSendChatHistory(userEmail);
      setEmailDialogOpen(false);
      setUserEmail('');
      setIsValidEmail(false);
    }
  };

  const handleCancelSend = () => {
    setEmailDialogOpen(false);
    setUserEmail('');
    setIsValidEmail(false);
  };

  return (
    <>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 min-w-0 w-full max-w-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-medium text-gray-900">Direkter Support</span>
        </div>
        
        <p className="text-gray-800 text-sm mb-4">
          War die Antwort nicht hilfreich? Senden Sie Ihren Chatverlauf an unser Support-Team oder nehmen Sie direkt Kontakt auf.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0 w-full">
          <Button
            onClick={onOpenContactForm}
            className="w-full justify-center whitespace-normal sm:whitespace-nowrap leading-tight"
            size="sm"
          >
            <LifeBuoy className="w-4 h-4 mr-2" />
            Support kontaktieren
          </Button>
          
          <Button
            onClick={handleSendChatHistory}
            variant="outline"
            className="w-full justify-center whitespace-normal sm:whitespace-nowrap leading-tight"
            size="sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Chatverlauf per E-Mail senden
          </Button>
        </div>
        
        <p className="text-xs text-gray-600 mt-2">
          Support-E-Mail: support@renovirt.de
        </p>
      </div>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>E-Mail-Adresse für Antwort</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              An welche E-Mail-Adresse sollen wir Ihnen antworten?
            </p>
            
            <div>
              <Input
                type="email"
                placeholder="ihre@email.de"
                value={userEmail}
                onChange={handleEmailChange}
                className={`w-full ${!isValidEmail && userEmail ? 'border-red-500' : ''}`}
              />
              {!isValidEmail && userEmail && (
                <p className="text-xs text-red-500 mt-1">
                  Bitte geben Sie eine gültige E-Mail-Adresse ein.
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancelSend}>
                Abbrechen
              </Button>
              <Button 
                onClick={handleConfirmSend}
                disabled={!isValidEmail}
              >
                Chatverlauf senden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportMessage;
