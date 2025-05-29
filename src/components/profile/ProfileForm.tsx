
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, Building, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomerProfile } from '@/hooks/useCustomerProfile';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
    address: '',
    phone: '',
    industry: '',
    responsibility: '',
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
      setFormData({
        role: existingProfile.role || '',
        salutation: existingProfile.salutation || '',
        firstName: existingProfile.first_name || '',
        lastName: existingProfile.last_name || '',
        company: existingProfile.company || '',
        address: existingProfile.address || '',
        phone: existingProfile.phone || '',
        industry: existingProfile.industry || '',
        responsibility: existingProfile.responsibility || '',
      });
    }
  }, [existingProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveCustomerProfile({
        ...formData,
        dataSource: 'profile_update',
      });
      
      // Invalidate and refetch profile data
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
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Profil bearbeiten
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Persönliche Daten</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salutation">Anrede *</Label>
                <Select value={formData.salutation} onValueChange={(value) => handleInputChange('salutation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Anrede wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="herr">Herr</SelectItem>
                    <SelectItem value="frau">Frau</SelectItem>
                    <SelectItem value="divers">Divers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role">Rolle *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rolle wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="makler">Makler</SelectItem>
                    <SelectItem value="architekt">Architekt</SelectItem>
                    <SelectItem value="fotograf">Fotograf</SelectItem>
                    <SelectItem value="projektentwickler">Projektentwickler</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Ihr Vorname"
                />
              </div>

              <div>
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Ihr Nachname"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                E-Mail-Adresse kann nicht geändert werden
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Telefonnummer</Label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Geschäftsdaten</h3>
            
            <div>
              <Label htmlFor="company">Unternehmen</Label>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-400" />
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Ihr Unternehmen"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="industry">Branche</Label>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="z.B. Immobilien, Architektur"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="responsibility">Verantwortungsbereich</Label>
              <Textarea
                id="responsibility"
                value={formData.responsibility}
                onChange={(e) => handleInputChange('responsibility', e.target.value)}
                placeholder="Beschreiben Sie Ihren Verantwortungsbereich..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-3" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Straße, PLZ, Stadt"
                  rows={3}
                />
              </div>
            </div>
          </div>

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
