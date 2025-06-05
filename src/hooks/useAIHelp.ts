
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AIHelpResponse {
  response: string;
  responseTime: number;
}

export const useAIHelp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { user } = useAuth();
  const { toast } = useToast();

  const askQuestion = async (question: string): Promise<string> => {
    if (!question.trim()) {
      throw new Error('Bitte geben Sie eine Frage ein.');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-help-assistant', {
        body: {
          question: question.trim(),
          userId: user?.id || null,
          sessionId: sessionId
        }
      });

      if (error) {
        console.error('AI Help Error:', error);
        throw new Error('Verbindung zum AI-Assistenten fehlgeschlagen.');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data.response;
    } catch (error: any) {
      console.error('Error asking AI question:', error);
      toast({
        title: "Fehler",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitFeedback = async (interactionId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('help_interactions')
        .update({ feedback_rating: rating })
        .eq('id', interactionId);

      if (error) throw error;

      toast({
        title: "Danke für Ihr Feedback!",
        description: "Ihre Bewertung hilft uns, den Service zu verbessern.",
      });
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Fehler",
        description: "Feedback konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const contactSupport = async (interactionId: string) => {
    try {
      const { error } = await supabase
        .from('help_interactions')
        .update({ contacted_support: true })
        .eq('id', interactionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking support contact:', error);
    }
  };

  return {
    askQuestion,
    submitFeedback,
    contactSupport,
    isLoading,
    sessionId
  };
};
