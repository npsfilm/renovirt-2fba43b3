
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'support';
  content: string;
  timestamp: Date;
  interactionId?: string;
  feedbackGiven?: boolean;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onFeedback: (messageId: string, interactionId: string, rating: number) => void;
  onContactSupport: (interactionId: string) => void;
  onSendChatHistory?: () => void;
  onOpenContactForm?: () => void;
  onSendTranscript?: () => void;
  onProblemSolved?: () => void;
}

const MessageList = ({ 
  messages, 
  isLoading, 
  onFeedback, 
  onContactSupport,
  onSendChatHistory,
  onOpenContactForm,
  onSendTranscript,
  onProblemSolved
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <p className="text-sm mb-4">
              Hallo! Ich bin Ihr RenoviRT AI-Assistent und kenne alle Details zu unserem Service.
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Ich kann Ihnen helfen bei Fragen zu:
            </p>
            <ul className="text-xs text-gray-400 text-left space-y-1">
              <li>• Paketen und Preisen</li>
              <li>• Lieferzeiten und Bearbeitung</li>
              <li>• Dateiformaten und Upload</li>
              <li>• Zahlungsmethoden</li>
              <li>• Datenschutz und Sicherheit</li>
            </ul>
            <p className="text-xs text-gray-400 mt-4">
              Wenn Sie mit einem Mitarbeiter sprechen möchten, sagen Sie es einfach!
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onFeedback={onFeedback}
            onContactSupport={onContactSupport}
            onSendChatHistory={onSendChatHistory}
            onOpenContactForm={onOpenContactForm}
            onSendTranscript={onSendTranscript}
            onProblemSolved={onProblemSolved}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 mb-4">
            <Bot className="w-8 h-8 rounded-full bg-gray-200 p-2" />
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
