
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import PersonalInformationSection from './PersonalInformationSection';
import BusinessInformationSection from './BusinessInformationSection';
import BillingAddressSection from './BillingAddressSection';

const ProfileForm = () => {
  const { user } = useAuth();
  const { saveCustomerProfile, loading } = useCustomerProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    role: '',
    salutation: '',
    firstName: '',
    lastName: '',
    company: '',
    billingEmail: '',
    vatId: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
    phone: '',
  });

  // Verbesserte Query-Konfiguration mit besserer Cache-Verwaltung
  const { data: existingProfile, isLoading, error } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('ProfileForm: No user ID available for profile fetch');
        return null;
      }
      
      console.log('ProfileForm: Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('ProfileForm: Error fetching profile:', error);
        throw error;
      }
      
      console.log('ProfileForm: Profile data fetched:', data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 Minuten
    cacheTime: 10 * 60 * 1000, // 10 Minuten
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    console.log('ProfileForm: useEffect triggered with existingProfile:', existingProfile);
    
    if (existingProfile) {
      // Parse address if it exists
      let addressParts = ['', '', '', 'Deutschland'];
      if (existingProfile.address) {
        const parts = existingProfile.address.split(', ');
        if (parts.length >= 4) {
          addressParts = [parts[0], parts[1], parts[2], parts[3]];
        } else if (parts.length === 3) {
          addressParts = [parts[0], parts[1], parts[2], 'Deutschland'];
        } else if (parts.length === 2) {
          addressParts = [parts[0], parts[1], '', 'Deutschland'];
        } else if (parts.length === 1) {
          addressParts = [parts[0], '', '', 'Deutschland'];
        }
      }
      
      const newFormData = {
        role: existingProfile.role || '',
        salutation: existingProfile.salutation || '',
        firstName: existingProfile.first_name || '',
        lastName: existingProfile.last_name || '',
        company: existingProfile.company || '',
        billingEmail: existingProfile.billing_email || '',
        vatId: existingProfile.vat_id || '',
        street: addressParts[0] || '',
        city: addressParts[1] || '',
        postalCode: addressParts[2] || '',
        country: addressParts[3] || 'Deutschland',
        phone: existingProfile.phone || '',
      };
      
      console.log('ProfileForm: Setting form data:', newFormData);
      setFormData(newFormData);
    } else {
      console.log('ProfileForm: No existing profile found, keeping default form data');
    }
  }, [existingProfile]);

  // Debug logging für User-Changes
  useEffect(() => {
    console.log('ProfileForm: User changed:', user?.id);
  }, [user?.id]);

  const handleInputChange = (field: string, value: string) => {
    console.log('ProfileForm: Input changed:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ProfileForm: Submit started with data:', formData);
    
    try {
      // Combine address fields
      const address = `${formData.street}, ${formData.city}, ${formData.postalCode}, ${formData.country}`;
      
      const profileData = {
        ...formData,
        address,
        dataSource: 'profile_update',
      };
      
      console.log('ProfileForm: Saving profile data:', profileData);
      
      // Optimistisches Update - setze die Daten sofort im Cache
      const optimisticData = {
        user_id: user?.id,
        role: formData.role,
        salutation: formData.salutation,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        billing_email: formData.billingEmail,
        vat_id: formData.vatId,
        address: address,
        phone: formData.phone,
        updated_at: new Date().toISOString(),
      };
      
      // Setze die Daten optimistisch im Cache
      queryClient.setQueryData(['customer-profile', user?.id], optimisticData);
      
      await saveCustomerProfile(profileData);
      
      // Invalidiere und refetche die Query
      await queryClient.invalidateQueries({ queryKey: ['customer-profile', user?.id] });
      
      console.log('ProfileForm: Profile saved successfully');
      
      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert.',
      });
    } catch (error) {
      console.error('ProfileForm: Error saving profile:', error);
      
      // Rollback des optimistischen Updates bei Fehler
      queryClient.invalidateQueries({ queryKey: ['customer-profile', user?.id] });
      
      toast({
        title: 'Fehler',
        description: 'Beim Speichern Ihrer Profildaten ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    }
  };

  // Debug-Informationen anzeigen
  if (error) {
    console.error('ProfileForm: Query error:', error);
  }

  if (isLoading) {
    console.log('ProfileForm: Loading profile data...');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2 text-primary" />
          Profil bearbeiten
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Profildaten werden geladen...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInformationSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <BusinessInformationSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <BillingAddressSection
              formData={formData}
              onInputChange={handleInputChange}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="px-8">
                {loading ? 'Speichern...' : 'Profil speichern'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
