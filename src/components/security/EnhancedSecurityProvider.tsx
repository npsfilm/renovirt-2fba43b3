import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeHTML, validateAndSanitizeInput, logXSSAttempt, isRateLimited } from '@/utils/enhancedXSSProtection';
import { logSecurityEvent } from '@/utils/secureLogging';

interface SecurityContextType {
  sanitizeInput: (input: string, options?: any) => string;
  validateInput: (input: string, options?: any) => { sanitized: string; isValid: boolean; errors: string[] };
  reportSecurityIncident: (type: string, details: any) => void;
  isSecurityBlocked: boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const EnhancedSecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isSecurityBlocked, setIsSecurityBlocked] = useState(false);
  
  const userIdentifier = user?.id || 'anonymous';

  useEffect(() => {
    // Check if user is rate limited on mount
    setIsSecurityBlocked(isRateLimited(userIdentifier));
  }, [userIdentifier]);

  const sanitizeInput = (input: string, options?: any): string => {
    if (isSecurityBlocked) {
      logSecurityEvent('blocked_input_attempt', { userIdentifier });
      return '';
    }
    
    return sanitizeHTML(input);
  };

  const validateInput = (input: string, options?: any) => {
    if (isSecurityBlocked) {
      logSecurityEvent('blocked_validation_attempt', { userIdentifier });
      return { sanitized: '', isValid: false, errors: ['Benutzer temporär blockiert'] };
    }

    const result = validateAndSanitizeInput(input, options);
    
    if (!result.isValid) {
      logXSSAttempt(userIdentifier, input);
      logSecurityEvent('xss_attempt_detected', {
        userIdentifier,
        inputLength: input.length,
        errors: result.errors
      });
      
      // Check if user should be blocked
      if (isRateLimited(userIdentifier)) {
        setIsSecurityBlocked(true);
        logSecurityEvent('user_security_blocked', { userIdentifier });
      }
    }
    
    return result;
  };

  const reportSecurityIncident = (type: string, details: any) => {
    logSecurityEvent(`security_incident_${type}`, {
      userIdentifier,
      details,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <SecurityContext.Provider value={{
      sanitizeInput,
      validateInput,
      reportSecurityIncident,
      isSecurityBlocked
    }}>
      {children}
    </SecurityContext.Provider>
  );
};