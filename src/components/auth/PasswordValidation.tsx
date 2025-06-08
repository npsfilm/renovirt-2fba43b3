
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation = ({ password }: PasswordValidationProps) => {
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-sm ${
      isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }`}>
      {isValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="space-y-2 mt-2 p-3 bg-muted rounded-md border">
      <div className="text-sm text-foreground font-medium">Passwort-Anforderungen:</div>
      <ValidationItem isValid={hasMinLength} text="Mind. 8 Zeichen" />
      <ValidationItem isValid={hasLowercase} text="Mind. ein Kleinbuchstabe (a-z)" />
      <ValidationItem isValid={hasUppercase} text="Mind. ein Großbuchstabe (A-Z)" />
      <ValidationItem isValid={hasNumber} text="Mind. eine Zahl (0-9)" />
      <ValidationItem isValid={hasSpecialChar} text="Mind. ein Sonderzeichen (!@#$%^&*)" />
      
      {password.length > 0 && hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar && (
        <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 font-medium mt-3">
          <Check className="h-4 w-4" />
          <span>Passwort erfüllt alle Anforderungen!</span>
        </div>
      )}
      
      {password.length > 0 && (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) && (
        <div className="text-xs text-muted-foreground mt-2">
          Beispiel: MeinSicheres123!
        </div>
      )}
    </div>
  );
};

export default PasswordValidation;
