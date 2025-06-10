
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

  const { data: existingProfile } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
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
      
      setFormData({
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
      });
    }
  }, [existingProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Combine address fields
      const address = `${formData.street}, ${formData.city}, ${formData.postalCode}, ${formData.country}`;
      
      await saveCustomerProfile({
        ...formData,
        address,
        dataSource: 'profile_update',
      });
      
      queryClient.invalidateQueries({ queryKey: ['customer-profile', user?.id] });
      
      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Profildaten wurden erfolgreich gespeichert.',
      });
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Beim Speichern Ihrer Profildaten ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2 text-primary" />
          Profil bearbeiten
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
