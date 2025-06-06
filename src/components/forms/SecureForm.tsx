
import React, { useEffect, useState } from 'react';
import { generateCSRFToken, withCSRFProtection } from '@/utils/csrfProtection';
import { sanitizeFormData } from '@/utils/enhancedInputValidation';
import { secureLog } from '@/utils/secureLogging';

interface SecureFormProps {
  children: React.ReactNode;
  onSubmit: (formData: any, csrfToken: string) => Promise<void>;
  className?: string;
  requireCSRF?: boolean;
}

const SecureForm = ({ 
  children, 
  onSubmit, 
  className = '', 
  requireCSRF = true 
}: SecureFormProps) => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    if (requireCSRF) {
      const token = generateCSRFToken();
      setCsrfToken(token);
    }
  }, [requireCSRF]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.currentTarget);
      const data: Record<string, any> = {};
      
      // Extract form data
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Sanitize form data
      const sanitizedData = sanitizeFormData(data);
      
      // Add CSRF protection if required
      const secureData = requireCSRF 
        ? withCSRFProtection(sanitizedData, csrfToken)
        : sanitizedData;

      secureLog('Secure form submission', { 
        formFields: Object.keys(sanitizedData),
        hasCSRF: requireCSRF 
      });

      await onSubmit(secureData, csrfToken);
    } catch (error) {
      secureLog('Secure form submission error', error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {requireCSRF && (
        <input type="hidden" name="csrf_token" value={csrfToken} />
      )}
      {children}
    </form>
  );
};

export default SecureForm;
