
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';
import { useProfileValidation } from './profile/useProfileValidation';
import { useProfileSanitization } from './profile/useProfileSanitization';
import { useProfileAuth } from './profile/useProfileAuth';
import { useProfileDatabase } from './profile/useProfileDatabase';
import type { CustomerProfileData } from './profile/types';

export type { CustomerProfileData } from './profile/types';

export const useCustomerProfile = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { validateProfileData } = useProfileValidation();
  const { sanitizeProfileData } = useProfileSanitization();
  const { getAuthenticatedUser } = useProfileAuth();
  const { saveProfileToDatabase, getProfileFromDatabase } = useProfileDatabase();

  const saveCustomerProfile = async (data: CustomerProfileData) => {
    try {
      setLoading(true);
      
      console.log('useCustomerProfile: Starting save operation with data:', data);
      
      // Validate data first
      const validation = validateProfileData(data);
      if (!validation.valid) {
        console.log('useCustomerProfile: Validation failed:', validation.errors);
        toast({
          title: 'Validierungsfehler',
          description: validation.errors.join(', '),
          variant: 'destructive',
        });
        return false;
      }
      
      // Get authenticated user
      const user = await getAuthenticatedUser();
      console.log('useCustomerProfile: User authenticated:', user.id);
      logSecurityEvent('profile_save_started', { userId: user.id });
      
      // Sanitize data
      const sanitizedData = sanitizeProfileData(data);
      console.log('useCustomerProfile: Data sanitized:', sanitizedData);
      
      // Save to database
      await saveProfileToDatabase(user.id, sanitizedData);
      
      toast({
        title: 'Profil gespeichert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert und sind dauerhaft verfügbar.',
      });

      return true;
    } catch (error: any) {
      console.error('useCustomerProfile: Error in saveCustomerProfile:', error);
      secureLog('Error in saveCustomerProfile:', error);
      
      if (error.message === 'Anmeldung erforderlich') {
        toast({
          title: 'Anmeldung erforderlich',
          description: 'Sie müssen angemeldet sein, um Ihr Profil zu speichern. Bitte melden Sie sich erneut an.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Fehler beim Speichern',
          description: error.message || 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
          variant: 'destructive',
        });
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCustomerProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        console.log('useCustomerProfile: User not authenticated for get operation');
        logSecurityEvent('profile_fetch_unauthorized');
        return null;
      }
      
      return await getProfileFromDatabase(session.user.id);
    } catch (error) {
      console.error('useCustomerProfile: Error in getCustomerProfile:', error);
      secureLog('Error in getCustomerProfile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveCustomerProfile,
    getCustomerProfile,
    loading,
  };
};
