
import React from 'react';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock } from 'lucide-react';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <div className="relative">
            <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            <Input
              id="firstName"
              name="firstName"
              placeholder="Vorname"
              value={formData.firstName}
              onChange={onInputChange}
              required
              className="bg-input border-border text-foreground placeholder-muted-foreground h-9 sm:h-10 lg:h-12 pl-8 sm:pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <div className="relative">
            <User className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
            <Input
              id="lastName"
              name="lastName"
              placeholder="Nachname"
              value={formData.lastName}
              onChange={onInputChange}
              required
              className="bg-input border-border text-foreground placeholder-muted-foreground h-9 sm:h-10 lg:h-12 pl-8 sm:pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="relative">
          <Mail className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <Input
            id="registerEmail"
            name="email"
            type="email"
            placeholder="ihre.email@beispiel.de"
            value={formData.email}
            onChange={onInputChange}
            required
            className="bg-input border-border text-foreground placeholder-muted-foreground h-9 sm:h-10 lg:h-12 pl-8 sm:pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="relative">
          <Lock className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
          <Input
            id="registerPassword"
            name="password"
            type="password"
            placeholder="Sicheres Passwort"
            value={formData.password}
            onChange={onInputChange}
            required
            className="bg-input border-border text-foreground placeholder-muted-foreground h-9 sm:h-10 lg:h-12 pl-8 sm:pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        {showPasswordValidation && (
          <PasswordValidation password={formData.password} />
        )}
      </div>
    </>
  );
};

export default RegisterFormFields;
