
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/secureLogging';

export const useProfileAuth = () => {
  const getAuthenticatedUser = async () => {
    let session = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!session && attempts < maxAttempts) {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('useProfileAuth: Session error:', sessionError);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      
      session = sessionData.session;
      attempts++;
    }
    
    if (!session?.user) {
      console.log('useProfileAuth: No active session found after', maxAttempts, 'attempts');
      logSecurityEvent('profile_save_no_session');
      throw new Error('Anmeldung erforderlich');
    }
    
    return session.user;
  };

  return { getAuthenticatedUser };
};
