
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAIHelp } from '@/hooks/useAIHelp';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FloatingButton from './FloatingButton';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'support';
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
  const { user } = useAuth();
  const { toast } = useToast();

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
      
      // Check if this is a support request
      if (response === 'SUPPORT_REQUEST') {
        const supportMessage: Message = {
          id: crypto.randomUUID(),
          type: 'support',
          content: '',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, supportMessage]);
        return;
      }
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        interactionId: crypto.randomUUID()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: 'Entschuldigung, ich konnte Ihre Frage nicht bearbeiten. Bitte versuchen Sie es erneut oder kontaktieren Sie unseren Support unter support@renovirt.de',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendChatHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-chat-history', {
        body: {
          messages: messages.filter(m => m.type !== 'support'),
          userId: user?.id || null,
          sessionId: crypto.randomUUID(),
          userEmail: user?.email || null
        }
      });

      if (error) throw error;

      toast({
        title: "Chat-Verlauf gesendet",
        description: "Ihr Chat-Verlauf wurde an support@renovirt.de gesendet. Sie erhalten in Kürze eine Antwort per E-Mail.",
      });

      // Add confirmation message
      const confirmationMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: 'Ihr Chat-Verlauf wurde erfolgreich an unser Support-Team gesendet. Sie erhalten in Kürze eine Antwort per E-Mail an Ihre registrierte E-Mail-Adresse.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmationMessage]);

    } catch (error) {
      console.error('Error sending chat history:', error);
      toast({
        title: "Fehler",
        description: "Chat-Verlauf konnte nicht gesendet werden.",
        variant: "destructive",
      });
    }
  };

  const handleOpenContactForm = () => {
    // Navigate to help page contact form
    window.location.href = '/help';
    toast({
      title: "Weiterleitung",
      description: "Sie werden zum Kontaktformular weitergeleitet.",
    });
  };

  const handleFeedback = async (messageId: string, interactionId: string, rating: number) => {
    try {
      await submitFeedback(interactionId, rating);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, feedbackGiven: true }
            : msg
        )
      );
      
      toast({
        title: "Feedback erhalten",
        description: "Vielen Dank für Ihr Feedback!",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Fehler",
        description: "Feedback konnte nicht gesendet werden.",
        variant: "destructive",
      });
    }
  };

  const handleContactSupport = async (interactionId: string) => {
    try {
      await contactSupport(interactionId);
      toast({
        title: "Support kontaktiert",
        description: "Wir haben Ihre Anfrage an unser Support-Team weitergeleitet.",
      });
    } catch (error) {
      console.error('Error contacting support:', error);
      toast({
        title: "Fehler", 
        description: "Support-Kontakt konnte nicht hergestellt werden.",
        variant: "destructive",
      });
    }
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
            onSendChatHistory={handleSendChatHistory}
            onOpenContactForm={handleOpenContactForm}
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
