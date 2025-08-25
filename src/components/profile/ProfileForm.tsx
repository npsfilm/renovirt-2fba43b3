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
  const { user, loading: authLoading } = useAuth();
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

  // Query to fetch existing profile with better error handling
  const { data: existingProfile, isLoading: profileLoading, error, refetch } = useQuery({
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
        .maybeSingle();

      if (error) {
        console.error('ProfileForm: Error fetching profile:', error);
        throw error;
      }
      
      console.log('ProfileForm: Profile data fetched:', data);
      return data;
    },
    enabled: !!user?.id && !authLoading,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache old data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
  });

  // Update form data when profile is loaded
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
        salutation: existingProfile.salutation?.toLowerCase() || '',
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
      console.log('ProfileForm: No existing profile found, keeping current form data');
    }
  }, [existingProfile]);

  const handleInputChange = (field: string, value: string) => {
    console.log('ProfileForm: Input changed:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ProfileForm: Submit started with data:', formData);
    console.log('ProfileForm: Current user:', user);
    
    // Wait for auth to load if still loading
    if (authLoading) {
      toast({
        title: 'Authentifizierung lädt',
        description: 'Bitte warten Sie, bis die Authentifizierung abgeschlossen ist.',
        variant: 'destructive',
      });
      return;
    }

    // Check user authentication
    if (!user?.id) {
      toast({
        title: 'Authentifizierung erforderlich',
        description: 'Bitte melden Sie sich an, um Ihr Profil zu speichern.',
        variant: 'destructive',
      });
      return;
    }
    
    // Client-side validation
    if (!formData.role) {
      toast({
        title: 'Fehlende Rolle',
        description: 'Bitte wählen Sie eine Rolle aus.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.salutation) {
      toast({
        title: 'Fehlende Anrede',
        description: 'Bitte wählen Sie eine Anrede aus.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      toast({
        title: 'Fehlende Namen',
        description: 'Bitte geben Sie Vor- und Nachname ein.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Combine address fields
      const address = `${formData.street}, ${formData.city}, ${formData.postalCode}, ${formData.country}`;
      
      const profileData = {
        ...formData,
        address,
        dataSource: 'profile_update',
      };
      
      console.log('ProfileForm: Saving profile data:', profileData);
      
      const success = await saveCustomerProfile(profileData);
      
      if (success) {
        // Invalidate and refetch the query after successful save
        console.log('ProfileForm: Profile saved successfully, refreshing data');
        await queryClient.invalidateQueries({ queryKey: ['customer-profile', user.id] });
        
        // Force a refetch to ensure we get the latest data
        setTimeout(() => {
          refetch();
        }, 500);
      }
      
    } catch (error) {
      console.error('ProfileForm: Error saving profile:', error);
      toast({
        title: 'Fehler beim Speichern',
        description: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-gray-600">Authentifizierung wird geladen...</div>
        </CardContent>
      </Card>
    );
  }

  // Show error if not authenticated
  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-600">Sie müssen angemeldet sein, um Ihr Profil zu bearbeiten.</div>
        </CardContent>
      </Card>
    );
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
        {profileLoading ? (
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
