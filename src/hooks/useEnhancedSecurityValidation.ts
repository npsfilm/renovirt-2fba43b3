import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { validateAndSanitizeInput } from '@/utils/enhancedXSSProtection';
import { logSecurityEvent } from '@/utils/secureLogging';
import { supabase } from '@/integrations/supabase/client';

interface ValidationOptions {
  maxLength?: number;
  allowedTags?: string[];
  stripTags?: boolean;
  required?: boolean;
}

export const useEnhancedSecurityValidation = () => {
  const { user } = useAuth();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const validateField = (
    fieldName: string,
    value: string,
    options: ValidationOptions = {}
  ): boolean => {
    const result = validateAndSanitizeInput(value, options);
    
    // Handle required field validation
    if (options.required && (!value || value.trim().length === 0)) {
      result.errors.push('Dieses Feld ist erforderlich');
      result.isValid = false;
    }

    if (!result.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: result.errors
      }));

      // Log security events for suspicious patterns
      if (result.errors.some(error => error.includes('dangerous content'))) {
        logSecurityEvent('form_xss_attempt', {
          fieldName,
          userId: user?.id,
          errors: result.errors
        });
      }
    } else {
      // Clear errors for this field
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    return result.isValid;
  };

  const validateForm = (
    formData: Record<string, string>,
    fieldOptions: Record<string, ValidationOptions> = {}
  ): { isValid: boolean; sanitizedData: Record<string, string>; errors: Record<string, string[]> } => {
    const sanitizedData: Record<string, string> = {};
    const errors: Record<string, string[]> = {};
    let isFormValid = true;

    Object.entries(formData).forEach(([fieldName, value]) => {
      const options = fieldOptions[fieldName] || {};
      const result = validateAndSanitizeInput(value, options);
      
      // Handle required field validation
      if (options.required && (!value || value.trim().length === 0)) {
        result.errors.push('Dieses Feld ist erforderlich');
        result.isValid = false;
      }

      sanitizedData[fieldName] = result.sanitized;
      
      if (!result.isValid) {
        errors[fieldName] = result.errors;
        isFormValid = false;
      }
    });

    setValidationErrors(errors);

    // Log form validation attempt
    if (!isFormValid) {
      logSecurityEvent('form_validation_failed', {
        userId: user?.id,
        fieldCount: Object.keys(formData).length,
        errorCount: Object.keys(errors).length
      });
    }

    return { isValid: isFormValid, sanitizedData, errors };
  };

  const checkAdminOperation = async (operation: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Use the existing has_admin_role function to check role
      const { data, error } = await supabase.rpc('has_admin_role', { user_uuid: user.id });
      
      if (error) {
        logSecurityEvent('admin_check_error', {
          userId: user.id,
          operation,
          error: error.message
        });
        return false;
      }

      if (!data) {
        logSecurityEvent('unauthorized_admin_attempt', {
          userId: user.id,
          operation
        });
      }

      return Boolean(data);
    } catch (error) {
      logSecurityEvent('admin_check_exception', {
        userId: user.id,
        operation,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  const clearErrors = () => {
    setValidationErrors({});
  };

  return {
    validateField,
    validateForm,
    checkAdminOperation,
    validationErrors,
    clearErrors
  };
};