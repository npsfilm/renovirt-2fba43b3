import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { OnboardingData } from '@/pages/Onboarding';
import { toast } from '@/components/ui/use-toast';

interface PersonalDataStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  loading?: boolean;
}

export const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
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
    if (!data.salutation) {
      validationErrors.push('Bitte wählen Sie eine Anrede aus');
    }

    if (!data.firstName?.trim()) {
      validationErrors.push('Vorname ist erforderlich');
    }

    if (!data.lastName?.trim()) {
      validationErrors.push('Nachname ist erforderlich');
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
            <User className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Persönliche Angaben
        </h2>
        <p className="text-muted-foreground text-lg">
          Bitte geben Sie Ihre persönlichen Daten ein
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
        {/* Anrede */}
        <div className="space-y-2">
          <Label htmlFor="salutation" className="text-base font-medium">
            Anrede *
          </Label>
          <Select value={data.salutation} onValueChange={(value) => handleInputChange('salutation', value)}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Bitte wählen Sie Ihre Anrede" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Herr">Herr</SelectItem>
              <SelectItem value="Frau">Frau</SelectItem>
              <SelectItem value="Divers">Divers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vorname */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base font-medium">
            Vorname *
          </Label>
          <Input
            id="firstName"
            type="text"
            value={data.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Ihr Vorname"
            className="h-12 text-base"
            autoFocus
          />
        </div>

        {/* Nachname */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base font-medium">
            Nachname *
          </Label>
          <Input
            id="lastName"
            type="text"
            value={data.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Ihr Nachname"
            className="h-12 text-base"
          />
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