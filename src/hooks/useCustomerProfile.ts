
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
  billingEmail?: string;
  vatId?: string;
  address: string;
  phone: string;
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

    if (data.billingEmail && !validateEmail(data.billingEmail)) {
      errors.push('Ungültiges E-Mail-Format für Rechnungs-E-Mail');
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
      billingEmail: data.billingEmail ? sanitizeInput(data.billingEmail) : undefined,
      vatId: data.vatId ? sanitizeInput(data.vatId) : undefined,
      address: sanitizeInput(data.address),
      phone: sanitizeInput(data.phone),
      dataSource: sanitizeInput(data.dataSource),
    };
  };

  const saveCustomerProfile = async (data: CustomerProfileData) => {
    try {
      setLoading(true);
      
      console.log('useCustomerProfile: Starting save operation with data:', data);
      
      // Validate data
      const validation = validateProfileData(data);
      if (!validation.valid) {
        console.log('useCustomerProfile: Validation failed:', validation.errors);
        toast({
          title: 'Validierungsfehler',
          description: validation.errors.join(', '),
          variant: 'destructive',
        });
        return;
      }
      
      // Sanitize data
      const sanitizedData = sanitizeProfileData(data);
      console.log('useCustomerProfile: Data sanitized:', sanitizedData);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log('useCustomerProfile: User not authenticated');
        logSecurityEvent('profile_save_unauthorized');
        throw new Error('User not authenticated');
      }
      
      console.log('useCustomerProfile: User authenticated:', user.user.id);
      logSecurityEvent('profile_save_started', { userId: user.user.id });
      
      const profilePayload = {
        user_id: user.user.id,
        role: sanitizedData.role,
        salutation: sanitizedData.salutation,
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        company: sanitizedData.company,
        billing_email: sanitizedData.billingEmail,
        vat_id: sanitizedData.vatId,
        address: sanitizedData.address,
        phone: sanitizedData.phone,
        data_source: sanitizedData.dataSource,
        app_role: 'client' as const, // Expliziter Typ für app_role
        updated_at: new Date().toISOString(),
      };
      
      console.log('useCustomerProfile: Payload prepared:', profilePayload);
      
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .upsert(profilePayload, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('useCustomerProfile: Database error:', error);
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

      console.log('useCustomerProfile: Profile saved successfully:', profileData);
      logSecurityEvent('profile_saved_successfully', { userId: user.user.id });
      
      toast({
        title: 'Profil gespeichert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert.',
      });

      return profileData;
    } catch (error) {
      console.error('useCustomerProfile: Error in saveCustomerProfile:', error);
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
        console.log('useCustomerProfile: User not authenticated for get operation');
        logSecurityEvent('profile_fetch_unauthorized');
        throw new Error('User not authenticated');
      }
      
      console.log('useCustomerProfile: Fetching profile for user:', user.user.id);
      
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) {
        console.error('useCustomerProfile: Fetch error:', error);
        logSecurityEvent('profile_fetch_failed', { 
          userId: user.user.id, 
          error: error.message 
        });
        throw error;
      }

      console.log('useCustomerProfile: Profile fetched successfully:', profileData);
      return profileData;
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
