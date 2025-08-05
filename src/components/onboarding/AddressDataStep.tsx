import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { OnboardingData } from '@/pages/Onboarding';
import { toast } from '@/components/ui/use-toast';

interface AddressDataStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  loading?: boolean;
}

export const AddressDataStep: React.FC<AddressDataStepProps> = ({
  data,
  updateData,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
  loading = false
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    updateData(field, value);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleNext = () => {
    const validationErrors: string[] = [];

    // Validate required fields
    if (!data.street?.trim()) {
      validationErrors.push('Straße und Hausnummer sind erforderlich');
    }

    if (!data.postalCode?.trim()) {
      validationErrors.push('Postleitzahl ist erforderlich');
    }

    if (!data.city?.trim()) {
      validationErrors.push('Stadt ist erforderlich');
    }

    if (!data.country?.trim()) {
      validationErrors.push('Land ist erforderlich');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      validationErrors.forEach(error => {
        toast({
          title: "Eingabe erforderlich",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Adressdaten
        </h2>
        <p className="text-muted-foreground text-lg">
          Bitte geben Sie Ihre Adresse ein
        </p>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Straße */}
        <div className="space-y-2">
          <Label htmlFor="street" className="text-base font-medium">
            Straße und Hausnummer *
          </Label>
          <Input
            id="street"
            type="text"
            value={data.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            placeholder="Musterstraße 123"
            className="h-12 text-base"
            autoFocus
          />
        </div>

        {/* PLZ und Stadt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-base font-medium">
              Postleitzahl *
            </Label>
            <Input
              id="postalCode"
              type="text"
              value={data.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              placeholder="12345"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-base font-medium">
              Stadt *
            </Label>
            <Input
              id="city"
              type="text"
              value={data.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Musterstadt"
              className="h-12 text-base"
            />
          </div>
        </div>

        {/* Land */}
        <div className="space-y-2">
          <Label htmlFor="country" className="text-base font-medium">
            Land *
          </Label>
          <Select value={data.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Bitte wählen Sie Ihr Land" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Deutschland">Deutschland</SelectItem>
              <SelectItem value="Österreich">Österreich</SelectItem>
              <SelectItem value="Schweiz">Schweiz</SelectItem>
              <SelectItem value="Andere">Andere</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Zurück</span>
        </Button>

        <div className="text-sm text-muted-foreground">
          Schritt {currentStep} von {totalSteps}
        </div>

        <Button
          onClick={handleNext}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <span>Weiter</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};