
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface BillingAddressSectionProps {
  formData: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BillingAddressSection: React.FC<BillingAddressSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Rechnungsadresse</h3>
      
      <div>
        <Label htmlFor="street">Straße und Hausnummer</Label>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => onInputChange('street', e.target.value)}
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
            onChange={(e) => onInputChange('city', e.target.value)}
            placeholder="Stadt"
          />
        </div>

        <div>
          <Label htmlFor="postalCode">PLZ</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => onInputChange('postalCode', e.target.value)}
            placeholder="12345"
          />
        </div>

        <div>
          <Label htmlFor="country">Land</Label>
          <Select value={formData.country} onValueChange={(value) => onInputChange('country', value)}>
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
  );
};

export default BillingAddressSection;
