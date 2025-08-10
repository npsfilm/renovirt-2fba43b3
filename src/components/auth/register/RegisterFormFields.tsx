
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
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="firstName"
              name="firstName"
              placeholder="Vorname"
              value={formData.firstName}
              onChange={onInputChange}
              required
              autoComplete="given-name"
              inputMode="text"
              autoCapitalize="words"
              className="bg-input border-border text-foreground placeholder-muted-foreground h-12 pl-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-base"
            />
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              id="lastName"
              name="lastName"
              placeholder="Nachname"
              value={formData.lastName}
              onChange={onInputChange}
              required
              autoComplete="family-name"
              inputMode="text"
              autoCapitalize="words"
              className="bg-input border-border text-foreground placeholder-muted-foreground h-12 pl-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-base"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            id="registerEmail"
            name="email"
            type="email"
            placeholder="Ihre E-Mail Adresse"
            value={formData.email}
            onChange={onInputChange}
            required
            inputMode="email"
            autoComplete="email"
            enterKeyHint="next"
            autoCapitalize="none"
            autoCorrect="off"
            className="bg-input border-border text-foreground placeholder-muted-foreground h-12 pl-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-base"
          />
        </div>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            id="registerPassword"
            name="password"
            type="password"
            placeholder="Sicheres Passwort"
            value={formData.password}
            onChange={onInputChange}
            required
            autoComplete="new-password"
            enterKeyHint="go"
            className="bg-input border-border text-foreground placeholder-muted-foreground h-12 pl-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 text-base"
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
