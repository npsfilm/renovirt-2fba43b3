
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation = ({ password }: PasswordValidationProps) => {
  const hasMinLength = password.length >= 10;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!$%&=?*#+\-<>]/.test(password);

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
      {isValid ? <Check size={16} /> : <X size={16} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="space-y-2 mt-2 p-3 bg-gray-800 rounded-md border border-gray-700">
      <div className="text-sm text-gray-300 font-medium">Passwort-Anforderungen:</div>
      <ValidationItem isValid={hasMinLength} text="Mind. 10 Zeichen" />
      <ValidationItem isValid={hasNumber} text="Mind. eine Zahl" />
      <ValidationItem isValid={hasSpecialChar} text="Mind. ein Sonderzeichen (!$%&=?*#+-<>)" />
    </div>
  );
};

export default PasswordValidation;
