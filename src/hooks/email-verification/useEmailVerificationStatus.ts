
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type EmailStatus = 'idle' | 'sending' | 'sent' | 'delivered' | 'clicked' | 'verified';

export const useEmailVerificationStatus = () => {
  const { user } = useAuth();
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');

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

  return {
    emailStatus,
    setEmailStatus
  };
};
