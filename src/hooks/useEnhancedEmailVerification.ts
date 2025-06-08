
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomEmailResend } from './useCustomEmailResend';
import { useAuth } from './useAuth';

interface VerificationAttempt {
  id: string;
  timestamp: number;
  method: 'supabase' | 'resend_custom';
  success: boolean;
  retryCount: number;
}

export const useEnhancedEmailVerification = () => {
  const { user } = useAuth();
  const { resendVerificationEmail, isLoading, canResend } = useCustomEmailResend();
  
  const [attempts, setAttempts] = useState<VerificationAttempt[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryDelay, setRetryDelay] = useState(10);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'delivered' | 'clicked' | 'verified'>('idle');
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);

  // Real-time email verification status tracking
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`email-verification-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auth.users',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new.email_confirmed_at && !payload.old.email_confirmed_at) {
            setEmailStatus('verified');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Smart retry logic with exponential backoff
  const calculateRetryDelay = (attemptCount: number): number => {
    return Math.min(10 * Math.pow(1.5, attemptCount), 120); // Max 2 minutes
  };

  // Smart suggestions based on email provider and attempts
  const generateSmartSuggestions = useCallback((email: string, attemptCount: number) => {
    const suggestions: string[] = [];
    const domain = email.split('@')[1]?.toLowerCase();

    if (attemptCount === 0) {
      suggestions.push('Überprüfen Sie Ihren Posteingang');
    } else if (attemptCount === 1) {
      suggestions.push('Schauen Sie in Ihren Spam-Ordner');
      if (domain?.includes('gmail')) {
        suggestions.push('Prüfen Sie auch den "Werbung" Tab in Gmail');
      }
    } else if (attemptCount >= 2) {
      suggestions.push('Fügen Sie no-reply@renovirt.de zu Ihren Kontakten hinzu');
      suggestions.push('Versuchen Sie es mit einer anderen E-Mail-Adresse');
    }

    setSmartSuggestions(suggestions);
  }, []);

  // Enhanced resend with smart retry logic
  const enhancedResend = async (forceRetry: boolean = false) => {
    if (!user?.email || (!canResend() && !forceRetry)) return;

    const currentAttemptCount = attempts.length;
    setEmailStatus('sending');
    setIsRetrying(true);

    try {
      const result = await resendVerificationEmail(
        user.email,
        user.user_metadata?.first_name,
        user.user_metadata?.last_name
      );

      const attempt: VerificationAttempt = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        method: result.data?.method || 'supabase',
        success: result.success,
        retryCount: currentAttemptCount
      };

      setAttempts(prev => [...prev, attempt]);

      if (result.success) {
        setEmailStatus('sent');
        generateSmartSuggestions(user.email, currentAttemptCount);
        
        // Set up next retry delay
        const nextDelay = calculateRetryDelay(currentAttemptCount + 1);
        setRetryDelay(nextDelay);
      } else {
        setEmailStatus('idle');
        // Auto-retry with exponential backoff if not too many attempts
        if (currentAttemptCount < 3) {
          const retryDelayMs = calculateRetryDelay(currentAttemptCount) * 1000;
          setTimeout(() => {
            enhancedResend(true);
          }, retryDelayMs);
        }
      }
    } catch (error) {
      setEmailStatus('idle');
      console.error('Enhanced resend failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Auto-retry logic for failed attempts
  useEffect(() => {
    const lastAttempt = attempts[attempts.length - 1];
    if (lastAttempt && !lastAttempt.success && attempts.length < 3) {
      const retryDelayMs = calculateRetryDelay(attempts.length) * 1000;
      const timer = setTimeout(() => {
        enhancedResend(true);
      }, retryDelayMs);
      
      return () => clearTimeout(timer);
    }
  }, [attempts]);

  // Email provider detection for helpful links
  const getEmailProviderInfo = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const providers = {
      'gmail.com': { 
        name: 'Gmail', 
        url: 'https://mail.google.com',
        tips: ['Prüfen Sie auch den "Werbung" und "Spam" Tab']
      },
      'outlook.com': { 
        name: 'Outlook', 
        url: 'https://outlook.live.com',
        tips: ['Schauen Sie in den "Junk-E-Mail" Ordner']
      },
      'hotmail.com': { 
        name: 'Outlook', 
        url: 'https://outlook.live.com',
        tips: ['Schauen Sie in den "Junk-E-Mail" Ordner']
      },
      'web.de': { 
        name: 'Web.de', 
        url: 'https://web.de',
        tips: ['Prüfen Sie den "Spam" Ordner']
      },
      'gmx.de': { 
        name: 'GMX', 
        url: 'https://gmx.de',
        tips: ['Überprüfen Sie den "Spamverdacht" Ordner']
      }
    };
    return providers[domain] || null;
  };

  const getVerificationProgress = () => {
    const steps = [
      { key: 'registration', label: 'Registrierung', completed: true },
      { key: 'email_sent', label: 'E-Mail gesendet', completed: emailStatus !== 'idle' },
      { key: 'email_delivered', label: 'E-Mail zugestellt', completed: ['delivered', 'clicked', 'verified'].includes(emailStatus) },
      { key: 'link_clicked', label: 'Link geklickt', completed: ['clicked', 'verified'].includes(emailStatus) },
      { key: 'verified', label: 'Bestätigt', completed: emailStatus === 'verified' }
    ];
    
    const completedSteps = steps.filter(step => step.completed).length;
    const progressPercentage = (completedSteps / steps.length) * 100;
    
    return { steps, progressPercentage };
  };

  return {
    enhancedResend,
    attempts,
    isRetrying: isRetrying || isLoading,
    canResend: canResend(),
    retryDelay,
    emailStatus,
    smartSuggestions,
    getEmailProviderInfo,
    getVerificationProgress,
    totalAttempts: attempts.length
  };
};
