
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '@/pages/Onboarding';

interface CompanyDataStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  totalSteps: number;
  completeOnboarding: () => void;
}

const CompanyDataStep = ({ data, updateData, nextStep, prevStep }: CompanyDataStepProps) => {
  const handleInputChange = (field: keyof OnboardingData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [field]: e.target.value });
  };

  const canProceed = data.salutation && data.firstName && data.lastName && data.address;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unternehmensdaten & Rechnungsinfos</h2>
        <p className="text-gray-600">
          Pflichtdaten für rechtssichere Rechnungsstellung.
        </p>
      </div>

      <div className="space-y-6">
        {/* Salutation */}
        <div>
          <Label htmlFor="salutation" className="text-sm font-medium text-gray-700">
            Anrede *
          </Label>
          <select
            id="salutation"
            value={data.salutation}
            onChange={handleInputChange('salutation')}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            <option value="">--Anrede auswählen--</option>
            <option value="herr">Herr</option>
            <option value="frau">Frau</option>
            <option value="divers">Divers</option>
          </select>
        </div>

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              Vorname *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={data.firstName}
              onChange={handleInputChange('firstName')}
              placeholder="Ihr Vorname"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Nachname *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={data.lastName}
              onChange={handleInputChange('lastName')}
              placeholder="Ihr Nachname"
              className="mt-1"
              required
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <Label htmlFor="company" className="text-sm font-medium text-gray-700">
            Firmenname (optional)
          </Label>
          <Input
            id="company"
            type="text"
            value={data.company}
            onChange={handleInputChange('company')}
            placeholder="Ihre Firma"
            className="mt-1"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Telefonnummer (optional, aber empfohlen)
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={handleInputChange('phone')}
            placeholder="z.B. 0712 000 000"
            className="mt-1"
          />
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Rechnungsadresse *
          </Label>
          <textarea
            id="address"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="Straße, PLZ, Ort, Land"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            rows={3}
            required
          />
        </div>

        {/* VAT ID */}
        <div>
          <Label htmlFor="vatId" className="text-sm font-medium text-gray-700">
            Umsatzsteuer-ID (optional)
          </Label>
          <Input
            id="vatId"
            type="text"
            value={data.vatId}
            onChange={handleInputChange('vatId')}
            placeholder="DE123456789"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={prevStep}>
          Zurück
        </Button>
        <Button 
          onClick={nextStep} 
          disabled={!canProceed}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default CompanyDataStep;
