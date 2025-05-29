
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const saveCustomerProfile = async (data: CustomerProfileData) => {
    try {
      setLoading(true);
      
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: data.role,
          salutation: data.salutation,
          first_name: data.firstName,
          last_name: data.lastName,
          company: data.company,
          address: data.address,
          phone: data.phone,
          industry: data.industry,
          responsibility: data.responsibility,
          data_source: data.dataSource,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving customer profile:', error);
        toast({
          title: 'Fehler beim Speichern',
          description: 'Ihre Profildaten konnten nicht gespeichert werden.',
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Profil gespeichert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert.',
      });

      return profileData;
    } catch (error) {
      console.error('Error in saveCustomerProfile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCustomerProfile = async () => {
    try {
      setLoading(true);
      
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching customer profile:', error);
        throw error;
      }

      return profileData;
    } catch (error) {
      console.error('Error in getCustomerProfile:', error);
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
