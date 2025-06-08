
import { useToast } from '@/hooks/use-toast';

export const useFormValidation = () => {
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 10;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!$%&=?*#+-<>]/.test(password);
    
    return hasMinLength && hasNumber && hasSpecialChar;
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

    if (!validatePassword(formData.password)) {
      toast({
        title: 'Fehler',
        description: 'Das Passwort erfüllt nicht alle Anforderungen.',
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
    validatePassword
  };
};
