
import React from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Mail } from 'lucide-react';
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
  onSendChatHistory?: () => void;
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
      
      <div className="flex flex-col max-w-[75%]">
        <div className={`px-4 py-2 rounded-lg mb-1 ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className={`flex items-center text-xs text-gray-500 ${
          message.type === 'user' ? 'justify-end' : ''
        }`}>
          <span>{formatTime(new Date(message.timestamp))}</span>
          
          {message.type === 'ai' && message.interactionId && !message.feedbackGiven && (
            <div className="flex items-center ml-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 text-gray-500 hover:text-green-600"
                onClick={() => onFeedback(message.id, message.interactionId!, 5)}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-1 text-gray-500 hover:text-red-600"
                onClick={() => onFeedback(message.id, message.interactionId!, 1)}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </Button>
              
              {onContactSupport && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-1 ml-1 text-gray-500 hover:text-blue-600"
                  onClick={() => onContactSupport(message.interactionId!)}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}

          {message.type === 'ai' && message.feedbackGiven && (
            <div className="ml-2 text-xs text-gray-400">Danke für Ihr Feedback</div>
          )}

          {message.content.includes('Problem gelöst?') && onProblemSolved && onSendTranscript && (
            <div className="flex items-center space-x-2 ml-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2 text-green-600 hover:bg-green-50"
                onClick={onProblemSolved}
              >
                Ja, gelöst
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-6 px-2 text-blue-600 hover:bg-blue-50"
                onClick={onSendTranscript}
              >
                Transcript senden
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
