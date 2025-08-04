import React from 'react';
import { Check, X } from 'lucide-react';
interface PasswordValidationProps {
  password: string;
}
const PasswordValidation = ({
  password
}: PasswordValidationProps) => {
  const hasMinLength = password.length >= 10;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const ValidationItem = ({
    isValid,
    text
  }: {
    isValid: boolean;
    text: string;
  }) => <div className={`flex items-center space-x-2 text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
      {isValid ? <Check size={16} /> : <X size={16} />}
      <span>{text}</span>
    </div>;
  return <div className="space-y-2 mt-2 p-3 bg-gray-800 rounded-md border border-gray-700">
      <div className="text-sm text-gray-300 font-medium">Passwort-Anforderungen:</div>
      <ValidationItem isValid={hasMinLength} text="Mind. 10 Zeichen" />
      <ValidationItem isValid={hasLowercase} text="Mind. ein Kleinbuchstabe (a-z)" />
      <ValidationItem isValid={hasUppercase} text="Mind. ein Großbuchstabe (A-Z)" />
      <ValidationItem isValid={hasNumber} text="Mind. eine Zahl (0-9)" />
      <ValidationItem isValid={hasSpecialChar} text="Mind. ein Sonderzeichen (!@#$%^&*)" />
      
      {password.length > 0 && hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar && <div className="flex items-center space-x-2 text-sm text-green-500 font-medium mt-3">
          <Check size={16} />
          <span>Passwort erfüllt alle Anforderungen!</span>
        </div>}
      
      {password.length > 0 && (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar)}
    </div>;
};
export default PasswordValidation;