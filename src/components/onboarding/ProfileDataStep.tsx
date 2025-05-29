import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingData } from '@/pages/Onboarding';

interface ProfileDataStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
}

const industries = [
  'Immobilienmakler',
  'Architekturbüro',
  'Fotostudio',
  'Bauunternehmen',
  'Immobilienentwicklung',
  'Property Management',
  'Sonstiges'
];

const ProfileDataStep = ({ data, updateData, nextStep, prevStep }: ProfileDataStepProps) => {
  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    updateData({ [field]: value });
  };

  const isFormValid = data.salutation && data.firstName && data.lastName && data.company;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Ihre Profildaten</h2>
        <p className="text-lg text-gray-600">
          Vervollständigen Sie Ihr Profil für eine personalisierte Erfahrung.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="salutation">Anrede *</Label>
          <Select value={data.salutation} onValueChange={(value) => handleInputChange('salutation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Wählen Sie..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="herr">Herr</SelectItem>
              <SelectItem value="frau">Frau</SelectItem>
              <SelectItem value="divers">Divers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">Vorname *</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Ihr Vorname"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nachname *</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Ihr Nachname"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Firma/Unternehmen *</Label>
          <Input
            id="company"
            value={data.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Firmenname"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Rechnungsadresse</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Straße, PLZ, Ort"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+49 ..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Branche</Label>
          <Select value={data.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Wählen Sie Ihre Branche" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Zurück
        </Button>
        <Button onClick={nextStep} disabled={!isFormValid}>
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default ProfileDataStep;
