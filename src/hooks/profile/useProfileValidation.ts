
import { validateEmail, validatePhone } from '@/utils/inputValidation';
import { CustomerProfileData, ValidationResult } from './types';

export const useProfileValidation = () => {
  const validateProfileData = (data: CustomerProfileData): ValidationResult => {
    const errors: string[] = [];
    
    // Validate required fields
    if (!data.role || !['makler', 'architekt', 'fotograf', 'projektentwickler', 'investor'].includes(data.role)) {
      errors.push('Ungültige Rolle ausgewählt');
    }
    
    if (!data.salutation || !['Herr', 'Frau', 'Divers'].includes(data.salutation)) {
      errors.push('Ungültige Anrede ausgewählt');
    }
    
    if (!data.firstName?.trim()) {
      errors.push('Vorname ist erforderlich');
    }
    
    if (!data.lastName?.trim()) {
      errors.push('Nachname ist erforderlich');
    }
    
    if (data.phone && !validatePhone(data.phone)) {
      errors.push('Ungültiges Telefonnummer-Format');
    }

    if (data.billingEmail && !validateEmail(data.billingEmail)) {
      errors.push('Ungültiges E-Mail-Format für Rechnungs-E-Mail');
    }
    
    return { valid: errors.length === 0, errors };
  };

  return { validateProfileData };
};
