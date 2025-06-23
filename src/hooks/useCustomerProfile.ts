
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
      
      // Get user session with multiple attempts
      let session = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!session && attempts < maxAttempts) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('useCustomerProfile: Session error:', sessionError);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
          continue;
        }
        
        session = sessionData.session;
        attempts++;
      }
      
      if (!session?.user) {
        console.log('useCustomerProfile: No active session found after', maxAttempts, 'attempts');
        logSecurityEvent('profile_save_no_session');
        toast({
          title: 'Anmeldung erforderlich',
          description: 'Sie müssen angemeldet sein, um Ihr Profil zu speichern. Bitte melden Sie sich erneut an.',
          variant: 'destructive',
        });
        return false;
      }
      
      const user = session.user;
      console.log('useCustomerProfile: User authenticated:', user.id);
      logSecurityEvent('profile_save_started', { userId: user.id });
      
      // Sanitize data
      const sanitizedData = sanitizeProfileData(data);
      console.log('useCustomerProfile: Data sanitized:', sanitizedData);
      
      const profilePayload = {
        user_id: user.id,
        role: sanitizedData.role,
        salutation: sanitizedData.salutation,
        first_name: sanitizedData.firstName,
        last_name: sanitizedData.lastName,
        company: sanitizedData.company || null,
        billing_email: sanitizedData.billingEmail || null,
        vat_id: sanitizedData.vatId || null,
        address: sanitizedData.address || null,
        phone: sanitizedData.phone || null,
        data_source: sanitizedData.dataSource,
        app_role: 'client' as const,
        updated_at: new Date().toISOString(),
      };
      
      console.log('useCustomerProfile: Payload prepared for database:', profilePayload);
      
      // First try to update existing profile
      const { data: existingProfile } = await supabase
        .from('customer_profiles')
        .select('id, user_id')
        .eq('user_id', user.id)
        .single();
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        console.log('useCustomerProfile: Updating existing profile');
        result = await supabase
          .from('customer_profiles')
          .update(profilePayload)
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Insert new profile
        console.log('useCustomerProfile: Creating new profile');
        result = await supabase
          .from('customer_profiles')
          .insert(profilePayload)
          .select()
          .single();
      }

      const { data: profileData, error } = result;

      if (error) {
        console.error('useCustomerProfile: Database error:', error);
        logSecurityEvent('profile_save_failed', { 
          userId: user.id, 
          error: error.message,
          payload: profilePayload
        });
        
        toast({
          title: 'Fehler beim Speichern',
          description: `Profildaten konnten nicht gespeichert werden: ${error.message}`,
          variant: 'destructive',
        });
        return false;
      }

      console.log('useCustomerProfile: Profile saved successfully:', profileData);
      logSecurityEvent('profile_saved_successfully', { userId: user.id });
      
      toast({
        title: 'Profil gespeichert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert und sind dauerhaft verfügbar.',
      });

      return true;
    } catch (error) {
      console.error('useCustomerProfile: Error in saveCustomerProfile:', error);
      secureLog('Error in saveCustomerProfile:', error);
      
      toast({
        title: 'Unerwarteter Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
      
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
      
      console.log('useCustomerProfile: Fetching profile for user:', session.user.id);
      
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('useCustomerProfile: Fetch error:', error);
        logSecurityEvent('profile_fetch_failed', { 
          userId: session.user.id, 
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
