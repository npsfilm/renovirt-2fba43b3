
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCustomEmailResend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<number>(0);

  const resendVerificationEmail = async (email: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    
    try {
      console.log('Using custom email resend for:', email);
      
      const { data, error } = await supabase.functions.invoke('resend-verification-email', {
        body: { 
          email,
          firstName,
          lastName 
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to send email');
      }

      setLastAttempt(Date.now());
      
      return { 
        success: true, 
        data: data,
        error: null 
      };

    } catch (error: any) {
      console.error('Custom email resend failed:', error);
      
      return { 
        success: false, 
        data: null, 
        error: error 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const canResend = () => {
    const timeSinceLastAttempt = Date.now() - lastAttempt;
    const minInterval = 10000; // 10 seconds minimum between attempts
    return timeSinceLastAttempt > minInterval;
  };

  return {
    resendVerificationEmail,
    isLoading,
    canResend,
    lastAttempt
  };
};
