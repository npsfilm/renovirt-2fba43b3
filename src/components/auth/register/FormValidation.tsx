
import { useToast } from '@/hooks/use-toast';

export const useFormValidation = () => {
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 10;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
    
    return hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
  };

  const getPasswordValidationErrors = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 10) {
      errors.push('Das Passwort muss mindestens 10 Zeichen lang sein');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Das Passwort muss mindestens einen Kleinbuchstaben enthalten');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Das Passwort muss mindestens einen Großbuchstaben enthalten');
    }
    if (!/\d/.test(password)) {
      errors.push('Das Passwort muss mindestens eine Zahl enthalten');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
      errors.push('Das Passwort muss mindestens ein Sonderzeichen enthalten');
    }
    
    return errors;
  };

  const validateForm = (
    formData: { email: string; password: string; firstName: string; lastName: string },
    referralCode: string,
    isReferralValid: boolean
  ) => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast({
        title: 'Fehler',
        description: 'Bitte füllen Sie alle Felder aus.',
        variant: 'destructive',
      });
      return false;
    }

    const passwordErrors = getPasswordValidationErrors(formData.password);
    if (passwordErrors.length > 0) {
      toast({
        title: 'Passwort-Anforderungen nicht erfüllt',
        description: passwordErrors[0], // Zeige den ersten Fehler
        variant: 'destructive',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return false;
    }

    // Only validate referral code if one was entered
    if (referralCode && referralCode.trim() && !isReferralValid) {
      toast({
        title: 'Fehler',
        description: 'Der eingegebene Empfehlungscode ist ungültig. Lassen Sie das Feld leer oder geben Sie einen gültigen Code ein.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return {
    validateForm,
    validatePassword,
    getPasswordValidationErrors
  };
};
