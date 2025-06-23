
import { supabase } from '@/integrations/supabase/client';
import { CustomerProfileData } from './types';
import { logSecurityEvent, secureLog } from '@/utils/secureLogging';

export const useProfileDatabase = () => {
  const saveProfileToDatabase = async (userId: string, sanitizedData: CustomerProfileData) => {
    const profilePayload = {
      user_id: userId,
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
    
    console.log('useProfileDatabase: Payload prepared for database:', profilePayload);
    
    // First try to update existing profile
    const { data: existingProfile } = await supabase
      .from('customer_profiles')
      .select('id, user_id')
      .eq('user_id', userId)
      .single();
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      console.log('useProfileDatabase: Updating existing profile');
      result = await supabase
        .from('customer_profiles')
        .update(profilePayload)
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      // Insert new profile
      console.log('useProfileDatabase: Creating new profile');
      result = await supabase
        .from('customer_profiles')
        .insert(profilePayload)
        .select()
        .single();
    }

    const { data: profileData, error } = result;

    if (error) {
      console.error('useProfileDatabase: Database error:', error);
      logSecurityEvent('profile_save_failed', { 
        userId, 
        error: error.message,
        payload: profilePayload
      });
      throw new Error(`Profildaten konnten nicht gespeichert werden: ${error.message}`);
    }

    console.log('useProfileDatabase: Profile saved successfully:', profileData);
    logSecurityEvent('profile_saved_successfully', { userId });
    
    return profileData;
  };

  const getProfileFromDatabase = async (userId: string) => {
    console.log('useProfileDatabase: Fetching profile for user:', userId);
    
    const { data: profileData, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('useProfileDatabase: Fetch error:', error);
      logSecurityEvent('profile_fetch_failed', { 
        userId, 
        error: error.message 
      });
      throw error;
    }

    console.log('useProfileDatabase: Profile fetched successfully:', profileData);
    return profileData;
  };

  return { saveProfileToDatabase, getProfileFromDatabase };
};
