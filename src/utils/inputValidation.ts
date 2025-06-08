
export const sanitizeFilename = (filename: string): string => {
  // Remove dangerous characters and limit length
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 255);
};

export const validateAndSanitizeText = (text: string, maxLength: number = 1000): string => {
  return text.substring(0, maxLength).replace(/[<>]/g, '');
};

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove dangerous HTML/script patterns
  const dangerous = /<script|javascript:|data:|vbscript:|onload|onerror|onclick/gi;
  let sanitized = input.replace(dangerous, '');
  
  // Remove other potentially dangerous characters
  sanitized = sanitized.replace(/[<>]/g, '');
  
  return sanitized.trim();
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check for valid German phone number length (7-15 digits)
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxRequests) {
    return false;
  }
  
  existing.count++;
  return true;
};
