
import React from 'react';
import { Input } from '@/components/ui/input';
import PasswordValidation from '../PasswordValidation';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterFormFieldsProps {
  formData: FormData;
  showPasswordValidation: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegisterFormFields = ({ 
  formData, 
  showPasswordValidation, 
  onInputChange 
}: RegisterFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            id="firstName"
            name="firstName"
            placeholder="Vorname"
            value={formData.firstName}
            onChange={onInputChange}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="lastName"
            name="lastName"
            placeholder="Nachname"
            value={formData.lastName}
            onChange={onInputChange}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Input
          id="registerEmail"
          name="email"
          type="email"
          placeholder="ihre.email@beispiel.de"
          value={formData.email}
          onChange={onInputChange}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Input
          id="registerPassword"
          name="password"
          type="password"
          placeholder="Passwort (mindestens 10 Zeichen)"
          value={formData.password}
          onChange={onInputChange}
          required
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
        />
        {showPasswordValidation && (
          <PasswordValidation password={formData.password} />
        )}
      </div>
    </>
  );
};

export default RegisterFormFields;
