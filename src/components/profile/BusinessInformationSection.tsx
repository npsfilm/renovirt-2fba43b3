
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building } from 'lucide-react';

interface BusinessInformationSectionProps {
  formData: {
    company: string;
    vatId: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BusinessInformationSection: React.FC<BusinessInformationSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Unternehmensdaten</h3>
      
      <div>
        <Label htmlFor="company">Unternehmen</Label>
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-gray-400" />
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => onInputChange('company', e.target.value)}
            placeholder="Ihr Unternehmen"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="vatId">Umsatzsteuer-ID</Label>
        <Input
          id="vatId"
          value={formData.vatId}
          onChange={(e) => onInputChange('vatId', e.target.value)}
          placeholder="DE123456789 (verpflichtend bei Unternehmen außerhalb von DE)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional - verpflichtend bei Unternehmen außerhalb von Deutschland
        </p>
      </div>
    </div>
  );
};

export default BusinessInformationSection;
