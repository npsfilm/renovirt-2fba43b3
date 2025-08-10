
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import RegisterHeader from './register/RegisterHeader';
import GoogleAuthButton from './register/GoogleAuthButton';
import RegisterFormFields from './register/RegisterFormFields';
import TermsAcceptance from './register/TermsAcceptance';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { useFormValidation } from './register/FormValidation';
import { useRegistrationToastHelper } from './RegistrationToastHelper';
import { AlertTriangle, LogIn, Lock } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [showAccountExistsAlert, setShowAccountExistsAlert] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const { validateForm, getPasswordValidationErrors } = useFormValidation();
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
    
    if (!validateForm(formData)) {
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting registration with:', { 
        email: formData.email, 
        firstName: formData.firstName, 
        lastName: formData.lastName,
        passwordLength: formData.password.length
      });
      
      const { data, error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'unspecified', // Rolle wird im Onboarding festgelegt
      });

      console.log('Registration result:', { data, error });

      // Check if user already exists (repeated signup) - Supabase returns user but no session
      if (data?.user && !data?.session) {
        console.log('User already exists (repeated signup), showing alert and sending notification email');
        setShowAccountExistsAlert(true);
        // Send background notification email
        try {
          const { error: emailError } = await supabase.functions.invoke('send-account-exists-notification', {
            body: { email: formData.email }
          });
          if (emailError) {
            console.error('Failed to send account exists notification:', emailError);
          } else {
            console.log('Account exists notification email sent successfully');
          }
        } catch (emailError) {
          console.error('Failed to send account exists notification:', emailError);
        }
        return; // Don't proceed with success flow
      }

      if (error) {
        console.error('Registration error:', error);
        const detailedMessage = getDetailedErrorMessage(error);
        showRegistrationError({
          message: detailedMessage,
          error_description: detailedMessage
        });
      } else if (data?.user && data?.session) {
        console.log('Registration successful for user:', data.user.email);
        
        // Show success message
        showRegistrationSuccess();
        
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
    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
      <RegisterHeader onSwitchToLogin={onSwitchToLogin} />

      <div className="space-y-2 sm:space-y-3">
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

{showAccountExistsAlert && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm">
            <div className="space-y-3">
              <p className="text-amber-800 font-medium">
                Ein Konto mit dieser E-Mail-Adresse existiert bereits.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAccountExistsAlert(false);
                    onSwitchToLogin();
                  }}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  <LogIn className="h-3 w-3 mr-2" />
                  Zur Anmeldung
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAccountExistsAlert(false);
                    setShowForgotPasswordDialog(true);
                  }}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                >
                  <Lock className="h-3 w-3 mr-2" />
                  Passwort vergessen
                </Button>
              </div>
              <p className="text-xs text-amber-600">
                Eine Sicherheitsbenachrichtigung wurde an Ihre E-Mail-Adresse gesendet.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleRegister} className="space-y-2 sm:space-y-3">
        <RegisterFormFields 
          formData={formData}
          showPasswordValidation={showPasswordValidation}
          onInputChange={handleInputChange}
        />
        
        <Button 
          type="submit" 
          className="w-full h-12 font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md text-base" 
          disabled={loading}
        >
          {loading ? 'Wird erstellt...' : 'Konto erstellen'}
        </Button>
      </form>
      
      <TermsAcceptance />

      <ForgotPasswordDialog
        open={showForgotPasswordDialog}
        onOpenChange={setShowForgotPasswordDialog}
      />
    </div>
  );
};

export default RegisterForm;
