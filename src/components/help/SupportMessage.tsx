
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
      <div className="w-full mb-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          {/* Header with Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <LifeBuoy className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm">
                Direkter Support
              </h3>
              <p className="text-xs text-muted-foreground">
                Professionelle Hilfe anfordern
              </p>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            War die Antwort nicht hilfreich? Senden Sie Ihren Chatverlauf an unser Support-Team oder nehmen Sie direkt Kontakt auf.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onOpenContactForm}
              className="w-full h-10 font-medium"
              size="default"
            >
              <LifeBuoy className="w-4 h-4 mr-2" />
              Support kontaktieren
            </Button>
            
            <Button
              onClick={handleSendChatHistory}
              variant="outline"
              className="w-full h-10 font-medium"
              size="default"
            >
              <Mail className="w-4 h-4 mr-2" />
              Chatverlauf per E-Mail senden
            </Button>
          </div>
          
          {/* Contact Info */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Support-E-Mail: <span className="font-medium">support@renovirt.de</span>
            </p>
          </div>
        </div>
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
