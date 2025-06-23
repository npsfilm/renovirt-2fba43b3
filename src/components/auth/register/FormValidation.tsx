
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordValidationErrors = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 10) {
      errors.push('Das Passwort muss mindestens 10 Zeichen haben');
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

  const validatePassword = (password: string): boolean => {
    return getPasswordValidationErrors(password).length === 0;
  };

  const validateForm = (formData: FormData): boolean => {
    // Email validation
    if (!formData.email.trim()) {
      toast({
        title: 'E-Mail erforderlich',
        description: 'Bitte geben Sie eine E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: 'Ungültige E-Mail',
        description: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return false;
    }

    // Name validation
    if (!formData.firstName.trim()) {
      toast({
        title: 'Vorname erforderlich',
        description: 'Bitte geben Sie Ihren Vornamen ein.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.lastName.trim()) {
      toast({
        title: 'Nachname erforderlich',
        description: 'Bitte geben Sie Ihren Nachnamen ein.',
        variant: 'destructive',
      });
      return false;
    }

    // Password validation
    if (!formData.password) {
      toast({
        title: 'Passwort erforderlich',
        description: 'Bitte geben Sie ein Passwort ein.',
        variant: 'destructive',
      });
      return false;
    }

    if (!validatePassword(formData.password)) {
      const errors = getPasswordValidationErrors(formData.password);
      toast({
        title: 'Passwort ungültig',
        description: errors[0], // Show first error
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return {
    validateForm,
    validateEmail,
    validatePassword,
    getPasswordValidationErrors,
  };
};
