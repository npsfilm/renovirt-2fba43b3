import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation = ({
  password
}: PasswordValidationProps) => {
  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  const ValidationItem = ({
    isValid,
    text
  }: {
    isValid: boolean;
    text: string;
  }) => (
    <div className={`flex items-center space-x-2 text-xs ${isValid ? 'text-green-500' : 'text-red-500'}`}>
      {isValid ? <Check size={14} /> : <X size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="space-y-1 mt-1 p-2 bg-gray-800 rounded-md border border-gray-700">
      <div className="text-xs text-gray-300 font-medium">Passwort-Anforderungen:</div>
      <ValidationItem isValid={hasMinLength} text="Mind. 10 Zeichen" />
      <ValidationItem isValid={hasUppercase} text="Mind. ein Großbuchstabe (A-Z)" />
      <ValidationItem isValid={hasNumber} text="Mind. eine Zahl (0-9)" />
      <ValidationItem isValid={hasSpecialChar} text="Mind. ein Sonderzeichen (!@#$%^&*)" />
    </div>
  );
};

export default PasswordValidation;