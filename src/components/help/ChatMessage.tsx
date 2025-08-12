
import React from 'react';

import { Button } from '@/components/ui/button';
import SupportMessage from './SupportMessage';
import { validateAndSanitizeInput } from '@/utils/enhancedXSSProtection';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'support';
  content: string;
  timestamp: Date;
  interactionId?: string;
  feedbackGiven?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onFeedback: (messageId: string, interactionId: string, rating: number) => void;
  onContactSupport: (interactionId: string) => void;
  onSendChatHistory?: (userEmail: string) => void;
  onOpenContactForm?: () => void;
  onSendTranscript?: () => void;
  onProblemSolved?: () => void;
}

const ChatMessage = ({ 
  message, 
  onFeedback, 
  onContactSupport,
  onSendChatHistory,
  onOpenContactForm,
  onSendTranscript,
  onProblemSolved
}: ChatMessageProps) => {
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (message.type === 'support') {
    return (
      <SupportMessage 
        onSendChatHistory={onSendChatHistory} 
        onOpenContactForm={onOpenContactForm}
      />
    );
  }

  return (
    <div className={`flex gap-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
        message.type === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'
      }`}>
        {message.type === 'user' ? 'Du' : 'AI'}
      </div>
      
      {/* Message Container */}
      <div className="flex flex-col min-w-0 max-w-[80%] sm:max-w-[70%]">
        {/* Message Bubble */}
        <div className={`px-4 py-3 rounded-xl shadow-sm ${
          message.type === 'user' 
            ? 'bg-primary text-primary-foreground rounded-tr-md' 
            : 'bg-card text-card-foreground border border-border rounded-tl-md'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ 
            __html: validateAndSanitizeInput(
              message.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n- /g, '\n• '),
              { allowedTags: ['strong','em','br'], maxLength: 5000 }
            ).sanitized
          }} />
        </div>
        
        {/* Metadata and Actions Container */}
        <div className={`mt-2 space-y-2 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
          {/* Timestamp */}
          <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-muted-foreground">
              {formatTime(new Date(message.timestamp))}
            </span>
          </div>
          
          {/* Feedback Actions - AI messages only */}
          {message.type === 'ai' && message.interactionId && !message.feedbackGiven && (
            <div className="w-full">
              <div className="bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  War diese Antwort hilfreich?
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 h-8 text-xs font-medium"
                    onClick={() => {
                      onFeedback(message.id, message.interactionId!, 5);
                      onProblemSolved?.();
                    }}
                  >
                    ✓ Ja, gelöst
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs font-medium"
                    onClick={() => {
                      onFeedback(message.id, message.interactionId!, 1);
                      onContactSupport(message.interactionId!);
                    }}
                  >
                    Nein, ich brauche mehr Hilfe
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Given Confirmation */}
          {message.type === 'ai' && message.feedbackGiven && (
            <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-md">
              ✓ Danke für Ihr Feedback
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
