
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { usePostHog } from '@/contexts/PostHogProvider';

interface AIHelpResponse {
  response: string;
  responseTime: number;
}

export const useAIHelp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const { user } = useAuth();
  const { toast } = useToast();
  const posthog = usePostHog();

  const askQuestion = async (question: string, hasExistingMessages: boolean = false): Promise<string> => {
    if (!question.trim()) {
      throw new Error('Bitte geben Sie eine Frage ein.');
    }

    const startTime = Date.now();
    setIsLoading(true);
    
    // PostHog: Track help question asked
    posthog.capture('help_question_asked', {
      question_length: question.length,
      has_existing_messages: hasExistingMessages,
      user_type: user ? 'authenticated' : 'anonymous',
      session_id: sessionId
    });
    try {
      const { data, error } = await supabase.functions.invoke('ai-help-assistant', {
        body: {
          question: question.trim(),
          userId: user?.id || null,
          sessionId: sessionId,
          hasExistingMessages
        }
      });

      if (error) {
        console.error('AI Help Error:', error);
        throw new Error('Verbindung zum AI-Assistenten fehlgeschlagen.');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const responseTime = Date.now() - startTime;
      
      // PostHog: Track successful AI response
      posthog.capture('help_response_received', {
        question_length: question.length,
        response_length: data.response.length,
        response_time_ms: responseTime,
        session_id: sessionId,
        user_type: user ? 'authenticated' : 'anonymous'
      });

      return data.response;
    } catch (error: any) {
      console.error('Error asking AI question:', error);
      
      // PostHog: Track AI help error
      posthog.capture('help_error', {
        error_message: error.message,
        question_length: question.length,
        session_id: sessionId,
        user_type: user ? 'authenticated' : 'anonymous'
      });
      
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
      // PostHog: Track feedback submission
      posthog.capture('help_feedback_given', {
        rating: rating,
        interaction_id: interactionId,
        session_id: sessionId,
        user_type: user ? 'authenticated' : 'anonymous'
      });

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
      // PostHog: Track support contact
      posthog.capture('help_support_contacted', {
        interaction_id: interactionId,
        session_id: sessionId,
        user_type: user ? 'authenticated' : 'anonymous'
      });

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
