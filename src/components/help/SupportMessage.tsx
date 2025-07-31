
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, MessageCircle } from 'lucide-react';

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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-medium text-blue-900">Direkter Support gewünscht</span>
        </div>
        
        <p className="text-blue-800 text-sm mb-4">
          Aktuell bieten wir keinen direkten Support über den Chat an. Möchten Sie Ihren Chatverlauf an unseren Support senden und wir antworten Ihnen per Mail oder möchten Sie uns eine Nachricht zukommen lassen?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSendChatHistory}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Chatverlauf senden
          </Button>
          
          <Button
            onClick={onOpenContactForm}
            variant="outline"
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Kontaktformular
          </Button>
        </div>
        
        <p className="text-xs text-blue-600 mt-2">
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
                className="bg-blue-600 hover:bg-blue-700"
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
