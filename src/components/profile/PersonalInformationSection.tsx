
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EmailChangeModal } from './EmailChangeModal';

interface PersonalInformationSectionProps {
  formData: {
    salutation: string;
    role: string;
    firstName: string;
    lastName: string;
    billingEmail: string;
    phone: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const { user } = useAuth();
  const [isEmailChangeModalOpen, setIsEmailChangeModalOpen] = useState(false);

  console.log('PersonalInformationSection: Current formData.role:', formData.role);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Persönliche Daten</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="salutation">Anrede *</Label>
          <Select value={formData.salutation} onValueChange={(value) => onInputChange('salutation', value)}>
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
          <Select 
            value={formData.role || ''} 
            onValueChange={(value) => {
              console.log('PersonalInformationSection: Role changed to:', value);
              onInputChange('role', value);
            }}
          >
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
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Ihr Vorname"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Nachname *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
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
          <button 
            onClick={() => setIsEmailChangeModalOpen(true)}
            className="text-blue-600 hover:underline"
          >
            Support
          </button>.
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
            onChange={(e) => onInputChange('billingEmail', e.target.value)}
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
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="+49 123 456789"
          />
        </div>
      </div>
      
      <EmailChangeModal 
        isOpen={isEmailChangeModalOpen}
        onClose={() => setIsEmailChangeModalOpen(false)}
      />
    </div>
  );
};

export default PersonalInformationSection;
