
import React from 'react';

import { Button } from '@/components/ui/button';
import SupportMessage from './SupportMessage';

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
    <div className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full ${
        message.type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'
      } flex items-center justify-center text-xs font-medium shrink-0`}>
        {message.type === 'user' ? 'Du' : 'AI'}
      </div>
      
      <div className="flex flex-col min-w-0 max-w-[85%] sm:max-w-[75%]">
        <div className={`px-4 py-2 rounded-lg mb-1 ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}>
          <div className="text-sm whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ 
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/\n- /g, '\n• ')
          }} />
        </div>
        
        <div className={`flex flex-wrap items-center text-xs text-gray-500 gap-2 ${message.type === 'user' ? 'justify-end' : ''}`}>
          <span>{formatTime(new Date(message.timestamp))}</span>
          
          {message.type === 'ai' && message.interactionId && !message.feedbackGiven && (
            <div className="flex flex-wrap items-center ml-2 gap-2 w-full sm:w-auto mt-1 sm:mt-0">
              <span className="text-xs text-gray-500">War diese Antwort hilfreich?</span>
              <Button
                variant="secondary"
                size="sm"
                className="h-6 px-2 whitespace-nowrap shrink-0"
                onClick={() => {
                  onFeedback(message.id, message.interactionId!, 5);
                  onProblemSolved?.();
                }}
              >
                Ja, gelöst
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 whitespace-nowrap shrink-0"
                onClick={() => {
                  onFeedback(message.id, message.interactionId!, 1);
                  onContactSupport(message.interactionId!);
                }}
              >
                Nein, ich brauche mehr Hilfe
              </Button>
            </div>
          )}

          {message.type === 'ai' && message.feedbackGiven && (
            <div className="ml-2 text-xs text-gray-400">Danke für Ihr Feedback</div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
