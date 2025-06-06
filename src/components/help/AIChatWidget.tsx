
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAIHelp } from '@/hooks/useAIHelp';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useChatPersistence } from '@/hooks/useChatPersistence';
import { useFollowUpSystem } from '@/hooks/useFollowUpSystem';
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
  const { sessionId, saveMessages, loadMessages, clearMessages } = useChatPersistence();
  const { startFollowUp, clearFollowUps, markProblemSolved, offerTranscript } = useFollowUpSystem();

  // Load messages on component mount
  useEffect(() => {
    const savedMessages = loadMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages, saveMessages]);

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
      const hasExistingMessages = messages.length > 0;
      const response = await askQuestion(inputValue, hasExistingMessages);
      
      // Check if this is a support request
      if (response === 'SUPPORT_REQUEST') {
        const supportMessage: Message = {
          id: crypto.randomUUID(),
          type: 'support',
          content: '',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, supportMessage]);
        
        // Start follow-up system
        startFollowUp(new Date());
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

  const handleSendChatHistory = async (sendCopyToUser: boolean = false) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-chat-history', {
        body: {
          messages: messages.filter(m => m.type !== 'support'),
          userId: user?.id || null,
          sessionId: sessionId,
          userEmail: user?.email || null,
          sendCopyToUser
        }
      });

      if (error) throw error;

      toast({
        title: "Chat-Verlauf gesendet",
        description: sendCopyToUser 
          ? "Ihr Chat-Verlauf wurde an support@renovirt.de gesendet und Sie erhalten eine Kopie per E-Mail."
          : "Ihr Chat-Verlauf wurde an support@renovirt.de gesendet. Sie erhalten in Kürze eine Antwort per E-Mail.",
      });

      // Add confirmation message
      const confirmationMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: sendCopyToUser 
          ? 'Ihr Chat-Verlauf wurde erfolgreich an unser Support-Team gesendet. Sie erhalten sowohl eine Bestätigung als auch die Antwort unseres Teams per E-Mail.'
          : 'Ihr Chat-Verlauf wurde erfolgreich an unser Support-Team gesendet. Sie erhalten in Kürze eine Antwort per E-Mail an Ihre registrierte E-Mail-Adresse.',
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

  const handleSendTranscript = () => {
    handleSendChatHistory(true);
    offerTranscript(user?.email);
  };

  const handleProblemSolved = () => {
    markProblemSolved();
    
    // Add a confirmation message
    const confirmationMessage: Message = {
      id: crypto.randomUUID(),
      type: 'ai',
      content: 'Wunderbar! Es freut mich, dass ich Ihnen helfen konnte. Falls Sie weitere Fragen haben, bin ich jederzeit da!',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMessage]);
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
            onSendChatHistory={() => handleSendChatHistory(false)}
            onOpenContactForm={handleOpenContactForm}
            onSendTranscript={handleSendTranscript}
            onProblemSolved={handleProblemSolved}
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
