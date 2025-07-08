
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { OnboardingData } from '@/pages/Onboarding';
import { validateCompanyData, validateAndSanitizeText } from '@/utils/enhancedInputValidation';
import { useToast } from '@/hooks/use-toast';
import { Building } from 'lucide-react';

interface CompanyDataStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
  loading?: boolean;
}

const countries = [
  { value: 'Deutschland', label: 'Deutschland' },
  { value: 'Österreich', label: 'Österreich' },
  { value: 'Schweiz', label: 'Schweiz' },
];

const CompanyDataStep = ({ data, updateData, nextStep, prevStep }: CompanyDataStepProps) => {
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    // Sanitize input before updating
    const sanitizedValue = validateAndSanitizeText(value);
    updateData({ [field]: sanitizedValue });
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleNext = () => {
    const validationErrors: string[] = [];

    // Required field validation
    if (!data.salutation) validationErrors.push('Anrede ist erforderlich');
    if (!data.firstName) validationErrors.push('Vorname ist erforderlich');
    if (!data.lastName) validationErrors.push('Nachname ist erforderlich');
    if (!data.street) validationErrors.push('Straße ist erforderlich');
    if (!data.city) validationErrors.push('Stadt ist erforderlich');
    if (!data.postalCode) validationErrors.push('Postleitzahl ist erforderlich');
    if (!data.country) validationErrors.push('Land ist erforderlich');

    // Company data validation (if provided)
    if (data.company || data.phone) {
      const validation = validateCompanyData({
        company: data.company,
        address: `${data.street}, ${data.city}, ${data.postalCode}, ${data.country}`,
        vatId: data.vatId,
        phone: data.phone,
      });

      if (!validation.valid) {
        validationErrors.push(...validation.errors);
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast({
        title: 'Validierungsfehler',
        description: validationErrors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    nextStep();
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="shrink-0 mb-3 lg:mb-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Building className="w-4 h-4 lg:w-6 lg:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg lg:text-2xl font-bold text-foreground">Unternehmensdaten</h1>
            <p className="text-sm lg:text-base text-primary font-medium">Für eine rechtssichere Abrechnung benötigen wir Ihre Daten.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {errors.length > 0 && (
          <div className="mb-4 p-3 lg:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="text-destructive">
              <h3 className="font-medium mb-2 text-sm lg:text-base">Bitte korrigieren Sie folgende Fehler:</h3>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-xs lg:text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-4 lg:space-y-6">
          {/* Personal Information */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-base lg:text-lg font-medium text-foreground">Persönliche Angaben</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              <div>
                <Label htmlFor="salutation" className="text-sm">Anrede *</Label>
                <Select value={data.salutation} onValueChange={(value) => handleInputChange('salutation', value)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Anrede wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="herr">Herr</SelectItem>
                    <SelectItem value="frau">Frau</SelectItem>
                    <SelectItem value="divers">Divers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div></div>

              <div>
                <Label htmlFor="firstName" className="text-sm">Vorname *</Label>
                <Input
                  id="firstName"
                  value={data.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Ihr Vorname"
                  className="h-9 text-sm"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm">Nachname *</Label>
                <Input
                  id="lastName"
                  value={data.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Ihr Nachname"
                  className="h-9 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-base lg:text-lg font-medium text-foreground">Adresse *</h3>
            
            <div className="space-y-3 lg:space-y-4">
              <div>
                <Label htmlFor="street" className="text-sm">Straße und Hausnummer *</Label>
                <Input
                  id="street"
                  value={data.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Musterstraße 123"
                  className="h-9 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
                <div>
                  <Label htmlFor="postalCode" className="text-sm">Postleitzahl *</Label>
                  <Input
                    id="postalCode"
                    value={data.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="12345"
                    className="h-9 text-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm">Stadt *</Label>
                  <Input
                    id="city"
                    value={data.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Musterstadt"
                    className="h-9 text-sm"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm">Land *</Label>
                  <Select value={data.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Land wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-base lg:text-lg font-medium text-foreground">Unternehmen</h3>
            
            <div>
              <Label htmlFor="company" className="text-sm">Firmenname</Label>
              <Input
                id="company"
                value={data.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Ihr Unternehmen"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm">Telefonnummer</Label>
              <Input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+49 123 456789"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="vatId" className="text-sm">Umsatzsteuer-ID</Label>
              <Input
                id="vatId"
                value={data.vatId}
                onChange={(e) => handleInputChange('vatId', e.target.value)}
                placeholder="DE123456789"
                className="h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional - verpflichtend bei Unternehmen außerhalb von Deutschland
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="shrink-0 flex justify-between pt-4 lg:pt-6">
        <Button 
          onClick={prevStep}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          Zurück
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
          size="sm"
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default CompanyDataStep;
