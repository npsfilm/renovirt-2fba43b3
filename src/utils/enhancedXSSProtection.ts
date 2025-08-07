/**
 * Enhanced XSS Protection Utilities
 */

// Comprehensive XSS patterns to detect and prevent
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi, // event handlers like onclick, onload, etc.
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*>/gi,
  /<link\b[^<]*href[^>]*>/gi,
  /<meta\b[^<]*>/gi,
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
];

// HTML entities map for encoding
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

export const sanitizeHTML = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // First pass: Remove dangerous patterns
  let sanitized = input;
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Second pass: Encode HTML entities
  sanitized = sanitized.replace(/[&<>"'`=/]/g, (match) => HTML_ENTITIES[match] || match);
  
  return sanitized;
};

export const validateAndSanitizeInput = (
  input: string, 
  options: {
    maxLength?: number;
    allowedTags?: string[];
    stripTags?: boolean;
  } = {}
): { sanitized: string; isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'string') {
    return { sanitized: '', isValid: false, errors: ['Input must be a string'] };
  }

  // Check length
  if (options.maxLength && input.length > options.maxLength) {
    errors.push(`Input exceeds maximum length of ${options.maxLength} characters`);
  }

  // Check for XSS patterns
  const hasXSS = XSS_PATTERNS.some(pattern => pattern.test(input));
  if (hasXSS) {
    errors.push('Potentially dangerous content detected');
  }

  // Sanitize the input
  let sanitized = options.stripTags ? input.replace(/<[^>]*>/g, '') : sanitizeHTML(input);
  
  // Trim to max length if specified
  if (options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  return {
    sanitized,
    isValid: errors.length === 0,
    errors
  };
};

export const createContentSecurityPolicy = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "block-all-mixed-content",
    "upgrade-insecure-requests"
  ].join('; ');
};

// Rate limiting for XSS attempts
const xssAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const logXSSAttempt = (userIdentifier: string, input: string): void => {
  const now = Date.now();
  const existing = xssAttempts.get(userIdentifier);
  
  if (!existing || now - existing.lastAttempt > 3600000) { // 1 hour window
    xssAttempts.set(userIdentifier, { count: 1, lastAttempt: now });
  } else {
    existing.count++;
    existing.lastAttempt = now;
    
    // Log security event if multiple attempts
    if (existing.count > 3) {
      console.error('[SECURITY] Multiple XSS attempts detected', {
        userIdentifier,
        attempts: existing.count,
        input: input.substring(0, 100) // Log first 100 chars only
      });
    }
  }
};

export const isRateLimited = (userIdentifier: string, maxAttempts: number = 5): boolean => {
  const attempts = xssAttempts.get(userIdentifier);
  return attempts ? attempts.count >= maxAttempts : false;
};