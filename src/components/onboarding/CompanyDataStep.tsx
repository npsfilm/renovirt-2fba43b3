
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
    // Validate all company data
    const validation = validateCompanyData({
      company: data.company,
      address: data.address,
      vatId: data.vatId,
      phone: data.phone,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      toast({
        title: 'Validierungsfehler',
        description: validation.errors.join(', '),
        variant: 'destructive',
      });
      return;
    }

    // Additional required field validation
    if (!data.salutation || !data.firstName || !data.lastName) {
      const missingFields = [];
      if (!data.salutation) missingFields.push('Anrede');
      if (!data.firstName) missingFields.push('Vorname');
      if (!data.lastName) missingFields.push('Nachname');
      
      setErrors([`Pflichtfelder fehlen: ${missingFields.join(', ')}`]);
      toast({
        title: 'Pflichtfelder fehlen',
        description: `Bitte füllen Sie folgende Felder aus: ${missingFields.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    nextStep();
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
            <Building className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Unternehmensdaten</h1>
            <p className="text-primary font-medium">Für eine rechtssichere Abrechnung benötigen wir Ihre Daten.</p>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="text-destructive">
            <h3 className="font-medium mb-2">Bitte korrigieren Sie folgende Fehler:</h3>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Persönliche Angaben</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salutation">Anrede *</Label>
              <Select value={data.salutation} onValueChange={(value) => handleInputChange('salutation', value)}>
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

            <div></div>

            <div>
              <Label htmlFor="firstName">Vorname *</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Ihr Vorname"
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Nachname *</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Ihr Nachname"
                required
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Unternehmen</h3>
          
          <div>
            <Label htmlFor="company">Firmenname</Label>
            <Input
              id="company"
              value={data.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Ihr Unternehmen"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+49 123 456789"
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Straße, Hausnummer, PLZ, Ort"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="vatId">Umsatzsteuer-ID</Label>
            <Input
              id="vatId"
              value={data.vatId}
              onChange={(e) => handleInputChange('vatId', e.target.value)}
              placeholder="DE123456789 (verpflichtend bei Unternehmen außerhalb von DE)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional - verpflichtend bei Unternehmen außerhalb von Deutschland
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <Button 
            onClick={prevStep}
            variant="outline"
            className="px-6"
          >
            Zurück
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDataStep;
