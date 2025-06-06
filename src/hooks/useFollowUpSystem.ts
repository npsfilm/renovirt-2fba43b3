
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FollowUpConfig {
  intervals: number[]; // in minutes
  enabled: boolean;
  lastSupportRequest?: Date;
}

export const useFollowUpSystem = () => {
  const [followUpConfig, setFollowUpConfig] = useState<FollowUpConfig>({
    intervals: [5, 10, 15],
    enabled: false
  });
  const { toast } = useToast();
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const startFollowUp = (lastSupportRequest: Date) => {
    // Clear existing timeouts
    clearFollowUps();
    
    setFollowUpConfig(prev => ({
      ...prev,
      enabled: true,
      lastSupportRequest
    }));

    // Schedule follow-up messages
    followUpConfig.intervals.forEach((interval) => {
      const timeoutId = setTimeout(() => {
        toast({
          title: "Problem gelöst?",
          description: `Konnten wir Ihnen nach ${interval} Minuten helfen? Benötigen Sie noch weitere Unterstützung?`,
          duration: 10000,
        });
      }, interval * 60 * 1000); // Convert minutes to milliseconds

      timeoutsRef.current.push(timeoutId);
    });
  };

  const clearFollowUps = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    setFollowUpConfig(prev => ({ ...prev, enabled: false }));
  };

  const markProblemSolved = () => {
    clearFollowUps();
    toast({
      title: "Danke für Ihr Feedback!",
      description: "Schön, dass wir Ihnen helfen konnten.",
    });
  };

  const offerTranscript = (userEmail?: string) => {
    if (userEmail) {
      toast({
        title: "Transcript anbieten",
        description: "Möchten Sie eine Zusammenfassung des Chats an Ihre E-Mail-Adresse erhalten?",
        duration: 15000,
      });
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      clearFollowUps();
    };
  }, []);

  return {
    followUpConfig,
    startFollowUp,
    clearFollowUps,
    markProblemSolved,
    offerTranscript
  };
};
