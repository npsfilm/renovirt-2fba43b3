
import { sanitizeInput, validateEmail, validatePhone } from './inputValidation';

// Enhanced validation functions for security
export const validateAndSanitizeText = (input: string, maxLength: number = 500): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potentially dangerous patterns
  const dangerous = /<script|javascript:|data:|vbscript:|onload|onerror|onclick/gi;
  let sanitized = input.replace(dangerous, '');
  
  // Apply existing sanitization
  sanitized = sanitizeInput(sanitized);
  
  // Trim to max length
  return sanitized.slice(0, maxLength).trim();
};

export const validateCompanyData = (data: {
  company?: string;
  address?: string;
  vatId?: string;
  phone?: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate company name
  if (data.company && data.company.length > 200) {
    errors.push('Firmenname ist zu lang (max. 200 Zeichen)');
  }

  // Validate address
  if (data.address) {
    if (data.address.length > 500) {
      errors.push('Adresse ist zu lang (max. 500 Zeichen)');
    }
    // Check for suspicious patterns in address
    const suspiciousPatterns = /<|>|javascript:|data:|script/gi;
    if (suspiciousPatterns.test(data.address)) {
      errors.push('Adresse enthält ungültige Zeichen');
    }
  }

  // Validate VAT ID format
  if (data.vatId) {
    const vatPattern = /^[A-Z]{2}[A-Z0-9]{2,12}$/i;
    if (!vatPattern.test(data.vatId.replace(/\s/g, ''))) {
      errors.push('Ungültiges USt-ID Format (z.B. DE123456789)');
    }
  }

  // Validate phone using existing function
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Ungültiges Telefonnummer-Format');
  }

  return { valid: errors.length === 0, errors };
};

export const sanitizeFormData = (formData: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (typeof value === 'string') {
      sanitized[key] = validateAndSanitizeText(value);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

// Rate limiting utilities
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitStore.get(key);
  
  if (!current || now - current.timestamp > windowMs) {
    rateLimitStore.set(key, { count: 1, timestamp: now });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false;
  }
  
  current.count++;
  return true;
};

export const cleanupRateLimitStore = () => {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.timestamp > windowMs) {
      rateLimitStore.delete(key);
    }
  }
};

// Initialize cleanup interval
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60000); // Clean up every minute
}
