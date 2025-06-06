
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Phone } from 'lucide-react';

interface SupportMessageProps {
  onSendChatHistory: () => void;
  onOpenContactForm: () => void;
}

const SupportMessage = ({ onSendChatHistory, onOpenContactForm }: SupportMessageProps) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Phone className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-blue-900">Direkter Support gewünscht</span>
      </div>
      
      <p className="text-blue-800 text-sm mb-4">
        Aktuell bieten wir keinen direkten Support über den Chat an. Möchten Sie Ihren Chatverlauf an unseren Support senden und wir antworten Ihnen per Mail oder möchten Sie uns eine Nachricht zukommen lassen?
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={onSendChatHistory}
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
  );
};

export default SupportMessage;
