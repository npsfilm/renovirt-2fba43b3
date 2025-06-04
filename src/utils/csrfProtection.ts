
import { secureLog } from './secureLogging';

// CSRF token management
let csrfToken: string | null = null;

export const generateCSRFToken = (): string => {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  csrfToken = token;
  
  // Store in session storage for the current session
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('csrf_token', token);
  }
  
  return token;
};

export const getCSRFToken = (): string | null => {
  if (csrfToken) return csrfToken;
  
  if (typeof window !== 'undefined') {
    csrfToken = sessionStorage.getItem('csrf_token');
  }
  
  return csrfToken;
};

export const validateCSRFToken = (providedToken: string): boolean => {
  const currentToken = getCSRFToken();
  
  if (!currentToken || !providedToken) {
    secureLog('CSRF token validation failed - missing token');
    return false;
  }
  
  if (currentToken !== providedToken) {
    secureLog('CSRF token validation failed - token mismatch');
    return false;
  }
  
  return true;
};

export const clearCSRFToken = (): void => {
  csrfToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('csrf_token');
  }
};

// Middleware for forms that need CSRF protection
export const withCSRFProtection = <T extends Record<string, any>>(
  formData: T,
  token?: string
): T & { csrf_token: string } => {
  const csrf_token = token || getCSRFToken() || generateCSRFToken();
  
  return {
    ...formData,
    csrf_token,
  };
};
