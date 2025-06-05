
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
    billingEmail: '',
    vatId: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
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
      // Parse address if it exists
      const addressParts = existingProfile.address ? existingProfile.address.split(', ') : ['', '', '', ''];
      
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
        industry: existingProfile.industry || '',
        responsibility: existingProfile.responsibility || '',
      });
    }
  }, [existingProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-fill billing address from company data
  const handleAutoFillAddress = () => {
    if (formData.company) {
      toast({
        title: 'Auto-Fill aktiviert',
        description: 'Adressdaten werden basierend auf Unternehmensdaten vorausgefüllt.',
      });
      // This would typically integrate with a company data API
      // For now, we'll show the concept
    } else {
      toast({
        title: 'Unternehmen erforderlich',
        description: 'Bitte geben Sie zuerst einen Unternehmensnamen ein.',
        variant: 'destructive',
      });
    }
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
                E-Mail-Adresse kann nicht geändert werden. Bitte melden Sie sich bei unserem{' '}
                <a href="/contact" className="text-blue-600 hover:underline">Support</a>.
              </p>
            </div>

            <div>
              <Label htmlFor="billingEmail">Rechnungs-E-Mail</Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <Input
                  id="billingEmail"
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                  placeholder="Separate E-Mail für Rechnungsversand (optional)"
                />
              </div>
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
            <h3 className="text-lg font-medium text-gray-900">Unternehmensdaten</h3>
            
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
              <Label htmlFor="vatId">Umsatzsteuer-ID</Label>
              <Input
                id="vatId"
                value={formData.vatId}
                onChange={(e) => handleInputChange('vatId', e.target.value)}
                placeholder="DE123456789 (verpflichtend bei Unternehmen außerhalb von DE)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional - verpflichtend bei Unternehmen außerhalb von Deutschland
              </p>
            </div>
          </div>

          {/* Billing Address - Moved directly after company information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Rechnungsadresse</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAutoFillAddress}
                className="text-sm"
              >
                <Building className="w-4 h-4 mr-2" />
                Auto-Fill aktivieren
              </Button>
            </div>
            
            <div>
              <Label htmlFor="street">Straße und Hausnummer</Label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Straße und Hausnummer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Stadt</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Stadt"
                />
              </div>

              <div>
                <Label htmlFor="postalCode">PLZ</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="12345"
                />
              </div>

              <div>
                <Label htmlFor="country">Land</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Land wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Deutschland">Deutschland</SelectItem>
                    <SelectItem value="Österreich">Österreich</SelectItem>
                    <SelectItem value="Schweiz">Schweiz</SelectItem>
                    <SelectItem value="Niederlande">Niederlande</SelectItem>
                    <SelectItem value="Belgien">Belgien</SelectItem>
                    <SelectItem value="Frankreich">Frankreich</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Zusätzliche Informationen</h3>
            
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
