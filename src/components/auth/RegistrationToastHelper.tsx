
import { useToast } from '@/hooks/use-toast';

export const useRegistrationToastHelper = () => {
  const { toast } = useToast();

  const showRegistrationSuccess = (hasReferralCode: boolean = false) => {
    toast({
      title: 'Registrierung erfolgreich',
      description: hasReferralCode 
        ? 'Bitte überprüfen Sie Ihre E-Mail für die Bestätigung. Ihre kostenlosen Bilder wurden vorgemerkt und werden nach der ersten Bestellung gutgeschrieben!'
        : 'Bitte überprüfen Sie Ihre E-Mail für die Bestätigung. Klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.',
    });
  };

  const showEmailSentSuccess = (isResend: boolean = false) => {
    toast({
      title: isResend ? 'E-Mail erneut gesendet' : 'Bestätigungs-E-Mail gesendet',
      description: isResend 
        ? 'Wir haben Ihnen eine neue Bestätigungs-E-Mail gesendet. Überprüfen Sie auch Ihren Spam-Ordner.'
        : 'Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse gesendet.',
    });
  };

  const showRegistrationError = (error: any) => {
    let errorMessage = 'Ein Fehler ist bei der Registrierung aufgetreten.';
    
    if (error?.message) {
      if (error.message.includes('User already registered')) {
        errorMessage = 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits. Versuchen Sie sich anzumelden oder verwenden Sie eine andere E-Mail-Adresse.';
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Das Passwort ist zu schwach. Bitte wählen Sie ein stärkeres Passwort mit mindestens 8 Zeichen.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      } else if (error.message.includes('signup_disabled')) {
        errorMessage = 'Die Registrierung ist derzeit deaktiviert. Bitte kontaktieren Sie den Support.';
      } else if (error.message.includes('rate_limit')) {
        errorMessage = 'Zu viele Registrierungsversuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.';
      }
    }
    
    toast({
      title: 'Registrierung fehlgeschlagen',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const showGoogleAuthError = (error: any) => {
    let errorMessage = 'Fehler bei der Google-Registrierung.';
    
    if (error?.message) {
      if (error.message.includes('popup_blocked')) {
        errorMessage = 'Das Popup wurde blockiert. Bitte erlauben Sie Popups für diese Seite und versuchen Sie es erneut.';
      } else if (error.message.includes('unauthorized')) {
        errorMessage = 'Google-Anmeldung ist nicht konfiguriert. Bitte kontaktieren Sie den Support.';
      }
    }
    
    toast({
      title: 'Google-Registrierung fehlgeschlagen',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const showEmailConfirmationError = (error: string) => {
    let errorMessage = 'Fehler bei der E-Mail-Bestätigung.';
    
    if (error.includes('token not found') || error.includes('invalid')) {
      errorMessage = 'Der Bestätigungslink ist ungültig oder bereits verwendet. Bitte fordern Sie eine neue E-Mail an.';
    } else if (error.includes('expired')) {
      errorMessage = 'Der Bestätigungslink ist abgelaufen. Bestätigungslinks sind nur 24 Stunden gültig.';
    }
    
    toast({
      title: 'E-Mail-Bestätigung fehlgeschlagen',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const showEmailResendError = (error: any) => {
    let errorMessage = 'Die E-Mail konnte nicht erneut gesendet werden.';
    
    if (error?.message) {
      if (error.message.includes('rate_limit')) {
        errorMessage = 'Zu viele E-Mail-Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.';
      } else if (error.message.includes('email_already_confirmed')) {
        errorMessage = 'Ihre E-Mail-Adresse ist bereits bestätigt. Sie können sich jetzt anmelden.';
      }
    }
    
    toast({
      title: 'Fehler beim E-Mail-Versand',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  return {
    showRegistrationSuccess,
    showEmailSentSuccess,
    showRegistrationError,
    showGoogleAuthError,
    showEmailConfirmationError,
    showEmailResendError,
  };
};
