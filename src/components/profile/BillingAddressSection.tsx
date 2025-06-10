
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BillingAddressSectionProps {
  formData: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const countries = [
  { value: 'Deutschland', label: 'Deutschland' },
  { value: 'Österreich', label: 'Österreich' },
  { value: 'Schweiz', label: 'Schweiz' },
];

const BillingAddressSection = ({ formData, onInputChange }: BillingAddressSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-foreground">Rechnungsadresse</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="street">Straße und Hausnummer</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => onInputChange('street', e.target.value)}
            placeholder="Musterstraße 123"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="postalCode">Postleitzahl</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => onInputChange('postalCode', e.target.value)}
              placeholder="12345"
            />
          </div>

          <div>
            <Label htmlFor="city">Stadt</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="Musterstadt"
            />
          </div>

          <div>
            <Label htmlFor="country">Land</Label>
            <Select value={formData.country} onValueChange={(value) => onInputChange('country', value)}>
              <SelectTrigger>
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
  );
};

export default BillingAddressSection;
