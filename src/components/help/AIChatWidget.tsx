
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAIHelp } from '@/hooks/useAIHelp';
import FloatingButton from './FloatingButton';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  interactionId?: string;
  feedbackGiven?: boolean;
}

const AIChatWidget = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { askQuestion, submitFeedback, contactSupport, isLoading } = useAIHelp();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await askQuestion(inputValue);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        interactionId: crypto.randomUUID()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: 'Entschuldigung, ich konnte Ihre Frage nicht bearbeiten. Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support unter support@renovirt.de',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleFeedback = async (messageId: string, interactionId: string, rating: number) => {
    await submitFeedback(interactionId, rating);
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedbackGiven: true }
          : msg
      )
    );
  };

  const handleContactSupport = async (interactionId: string) => {
    await contactSupport(interactionId);
  };

  if (!isOpen) {
    return <FloatingButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-[500px] shadow-2xl">
        <ChatHeader onClose={() => setIsOpen(false)} />
        
        <CardContent className="p-0 flex flex-col h-[420px]">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onFeedback={handleFeedback}
            onContactSupport={handleContactSupport}
          />
          
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChatWidget;
