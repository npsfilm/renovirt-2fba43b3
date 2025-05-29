
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput, validateEmail, validatePhone } from '@/utils/inputValidation';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';

export interface CustomerProfileData {
  role: string;
  salutation: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  phone: string;
  industry: string;
  responsibility: string;
  dataSource: string;
}

export const useCustomerProfile = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateProfileData = (data: CustomerProfileData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Validate required fields
    if (!data.role || !['makler', 'architekt', 'fotograf', 'projektentwickler', 'investor'].includes(data.role)) {
      errors.push('Ungültige Rolle ausgewählt');
    }
    
    if (!data.salutation || !['herr', 'frau', 'divers'].includes(data.salutation)) {
      errors.push('Ungültige Anrede ausgewählt');
    }
    
    if (!data.firstName?.trim()) {
      errors.push('Vorname ist erforderlich');
    }
    
    if (!data.lastName?.trim()) {
      errors.push('Nachname ist erforderlich');
    }
    
    if (data.phone && !validatePhone(data.phone)) {
      errors.push('Ungültiges Telefonnummer-Format');
    }
    
    return { valid: errors.length === 0, errors };
  };

  const sanitizeProfileData = (data: CustomerProfileData): CustomerProfileData => {
    return {
      role: data.role,
      salutation: data.salutation,
      firstName: sanitizeInput(data.firstName),
      lastName: sanitizeInput(data.lastName),
      company: sanitizeInput(data.company),
      address: sanitizeInput(data.address),
      phone: sanitizeInput(data.phone),
      industry: sanitizeInput(data.industry),
      responsibility: sanitizeInput(data.responsibility),
      dataSource: sanitizeInput(data.dataSource),
    };
  };

  const saveCustomerProfile = async (data: CustomerProfileData) => {
    try {
      setLoading(true);
      
      // Validate data
      const validation = validateProfileData(data);
      if (!validation.valid) {
        toast({
          title: 'Validierungsfehler',
          description: validation.errors.join(', '),
          variant: 'destructive',
        });
        return;
      }
      
      // Sanitize data
      const sanitizedData = sanitizeProfileData(data);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        logSecurityEvent('profile_save_unauthorized');
        throw new Error('User not authenticated');
      }
      
      logSecurityEvent('profile_save_started', { userId: user.user.id });
      
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .insert({
          user_id: user.user.id,
          role: sanitizedData.role,
          salutation: sanitizedData.salutation,
          first_name: sanitizedData.firstName,
          last_name: sanitizedData.lastName,
          company: sanitizedData.company,
          address: sanitizedData.address,
          phone: sanitizedData.phone,
          industry: sanitizedData.industry,
          responsibility: sanitizedData.responsibility,
          data_source: sanitizedData.dataSource,
          app_role: 'client', // Set default role to client
        })
        .select()
        .single();

      if (error) {
        logSecurityEvent('profile_save_failed', { 
          userId: user.user.id, 
          error: error.message 
        });
        
        toast({
          title: 'Fehler beim Speichern',
          description: 'Ihre Profildaten konnten nicht gespeichert werden.',
          variant: 'destructive',
        });
        throw error;
      }

      logSecurityEvent('profile_saved_successfully', { userId: user.user.id });
      
      toast({
        title: 'Profil gespeichert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert.',
      });

      return profileData;
    } catch (error) {
      secureLog('Error in saveCustomerProfile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCustomerProfile = async () => {
    try {
      setLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        logSecurityEvent('profile_fetch_unauthorized');
        throw new Error('User not authenticated');
      }
      
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) {
        logSecurityEvent('profile_fetch_failed', { 
          userId: user.user.id, 
          error: error.message 
        });
        throw error;
      }

      return profileData;
    } catch (error) {
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
