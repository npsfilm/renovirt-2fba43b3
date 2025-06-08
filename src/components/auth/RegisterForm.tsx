
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ReferralCodeInput from './ReferralCodeInput';
import RegisterHeader from './register/RegisterHeader';
import GoogleAuthButton from './register/GoogleAuthButton';
import RegisterFormFields from './register/RegisterFormFields';
import TermsAcceptance from './register/TermsAcceptance';
import { useFormValidation } from './register/FormValidation';
import { useReferralProcessing } from './register/ReferralProcessing';

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
  const { toast } = useToast();
  const { validateForm } = useFormValidation();
  const { processReferralReward } = useReferralProcessing();

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
        hasReferralCode: !!referralCode
      });
      
      const { data, error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'customer',
      });

      console.log('Registration result:', { data, error });

      if (error) {
        let errorMessage = 'Ein Fehler ist bei der Registrierung aufgetreten.';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Das Passwort ist zu schwach. Bitte wählen Sie ein stärkeres Passwort.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        }
        
        toast({
          title: 'Registrierung fehlgeschlagen',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (data?.user) {
        console.log('Registration successful for user:', data.user.email);
        
        if (referralCode && isReferralValid) {
          await processReferralReward(data.user.id, referralCode, isReferralValid);
        }
        
        toast({
          title: 'Registrierung erfolgreich',
          description: referralCode ? 
            'Bitte überprüfen Sie Ihre E-Mail für die Bestätigung. Ihre kostenlosen Bilder wurden gutgeschrieben!' :
            'Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.',
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
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
        toast({
          title: 'Google-Registrierung fehlgeschlagen',
          description: error.message || 'Fehler bei der Google-Registrierung.',
          variant: 'destructive',
        });
      } else {
        console.log('Google registration initiated successfully');
      }
    } catch (error: any) {
      console.error('Google registration error:', error);
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
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
