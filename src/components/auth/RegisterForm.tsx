
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import ReferralCodeInput from './ReferralCodeInput';
import RegisterHeader from './register/RegisterHeader';
import GoogleAuthButton from './register/GoogleAuthButton';
import RegisterFormFields from './register/RegisterFormFields';
import TermsAcceptance from './register/TermsAcceptance';
import { useFormValidation } from './register/FormValidation';
import { useReferralProcessing } from './register/ReferralProcessing';
import { useRegistrationToastHelper } from './RegistrationToastHelper';

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [referralCode, setReferralCode] = useState('');
  const [isReferralValid, setIsReferralValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const { validateForm, getPasswordValidationErrors } = useFormValidation();
  const { processReferralReward } = useReferralProcessing();
  const { 
    showRegistrationSuccess, 
    showRegistrationError, 
    showGoogleAuthError 
  } = useRegistrationToastHelper();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      setShowPasswordValidation(value.length > 0);
    }
  };

  const handleReferralCodeChange = (code: string, isValid: boolean) => {
    setReferralCode(code);
    setIsReferralValid(isValid);
  };

  const getDetailedErrorMessage = (error: any): string => {
    if (!error) return 'Ein unbekannter Fehler ist aufgetreten.';
    
    const errorMessage = error.message || error.error_description || error.msg || '';
    
    // Supabase-spezifische Fehlermeldungen übersetzen
    if (errorMessage.includes('Password should be at least')) {
      return 'Das Passwort erfüllt nicht die Mindestanforderungen. Bitte überprüfen Sie die Passwort-Richtlinien.';
    }
    
    if (errorMessage.includes('User already registered')) {
      return 'Diese E-Mail-Adresse ist bereits registriert. Versuchen Sie sich anzumelden oder verwenden Sie eine andere E-Mail-Adresse.';
    }
    
    if (errorMessage.includes('Invalid email')) {
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }
    
    if (errorMessage.includes('Signup requires a valid password')) {
      const passwordErrors = getPasswordValidationErrors(formData.password);
      return passwordErrors.length > 0 ? passwordErrors.join('. ') : 'Das Passwort ist ungültig.';
    }
    
    if (errorMessage.includes('weak password') || errorMessage.includes('password')) {
      return 'Das Passwort ist zu schwach. Es muss mindestens 10 Zeichen haben und Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen enthalten.';
    }
    
    // Fallback für andere Fehler
    return errorMessage || 'Ein Fehler bei der Registrierung ist aufgetreten. Bitte versuchen Sie es erneut.';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData, referralCode, isReferralValid)) {
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration with:', { 
        email: formData.email, 
        firstName: formData.firstName, 
        lastName: formData.lastName,
        hasReferralCode: !!referralCode,
        passwordLength: formData.password.length
      });
      
      const { data, error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'customer',
      });

      console.log('Registration result:', { data, error });

      if (error) {
        console.error('Registration error:', error);
        const detailedMessage = getDetailedErrorMessage(error);
        showRegistrationError({
          message: detailedMessage,
          error_description: detailedMessage
        });
      } else if (data?.user) {
        console.log('Registration successful for user:', data.user.email);
        
        // Process referral reward if applicable
        if (referralCode && isReferralValid) {
          await processReferralReward(data.user.id, referralCode, isReferralValid);
        }
        
        // Show success message with referral info
        showRegistrationSuccess(!!referralCode && isReferralValid);
        
        // Call success callback
        onSuccess();
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const detailedMessage = getDetailedErrorMessage(error);
      showRegistrationError({
        message: detailedMessage,
        error_description: detailedMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      console.log('Attempting Google registration');
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google registration error:', error);
        showGoogleAuthError(error);
      } else {
        console.log('Google registration initiated successfully');
        // The redirect will be handled by Supabase
      }
    } catch (error: any) {
      console.error('Google registration error:', error);
      showGoogleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <RegisterHeader onSwitchToLogin={onSwitchToLogin} />

      <div className="space-y-4">
        <GoogleAuthButton onClick={handleGoogleAuth} loading={loading} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">oder</span>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <RegisterFormFields 
          formData={formData}
          showPasswordValidation={showPasswordValidation}
          onInputChange={handleInputChange}
        />

        <ReferralCodeInput onReferralCodeChange={handleReferralCodeChange} />
        
        <Button 
          type="submit" 
          className="w-full h-12 font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md" 
          disabled={loading}
        >
          {loading ? 'Wird erstellt...' : 'Konto erstellen'}
        </Button>
      </form>
      
      <TermsAcceptance />
    </div>
  );
};

export default RegisterForm;
