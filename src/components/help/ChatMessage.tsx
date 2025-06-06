
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Mail, Bot, User } from 'lucide-react';
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
}

const ChatMessage = ({ 
  message, 
  onFeedback, 
  onContactSupport, 
  onSendChatHistory,
  onOpenContactForm 
}: ChatMessageProps) => {
  // Handle support request messages
  if (message.type === 'support') {
    return (
      <div className="mb-4">
        <SupportMessage 
          onSendChatHistory={onSendChatHistory || (() => {})}
          onOpenContactForm={onOpenContactForm || (() => {})}
        />
      </div>
    );
  }

  return (
    <div className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`inline-flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
        }`}>
          {message.type === 'user' ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-gray-600" />
          )}
        </div>
        
        <div className={`rounded-lg p-3 ${
          message.type === 'user' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
      
      {message.type === 'ai' && message.interactionId && !message.feedbackGiven && (
        <div className="flex items-center gap-2 mt-2 ml-10">
          <span className="text-xs text-gray-500">War das hilfreich?</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFeedback(message.id, message.interactionId!, 1)}
            className="h-6 w-6 p-0"
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFeedback(message.id, message.interactionId!, -1)}
            className="h-6 w-6 p-0"
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onContactSupport(message.interactionId!)}
            className="h-6 w-6 p-0"
          >
            <Mail className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
