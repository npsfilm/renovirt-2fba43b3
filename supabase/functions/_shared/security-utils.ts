// Shared security utilities for Edge Functions

interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized?: any;
}

// Validate and sanitize request body
export function validateRequestBody(
  body: any,
  requiredFields: string[],
  maxSize: number = 1024 * 1024 // 1MB default
): ValidationResult {
  const errors: string[] = [];
  
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }

  // Check for required fields
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate payload size
  const bodySize = JSON.stringify(body).length;
  if (bodySize > maxSize) {
    errors.push(`Request body too large: ${bodySize} bytes (max: ${maxSize})`);
  }

  // Sanitize string fields
  const sanitized = { ...body };
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  };
}

// Sanitize string input
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';

  // Remove potential XSS vectors
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  // Encode HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Trim to max length
  return sanitized.slice(0, maxLength).trim();
}

// Validate email format
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Rate limiting for Edge Functions
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 60,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

// Validate user authentication
export function validateAuth(authHeader: string | null): { valid: boolean; error?: string } {
  if (!authHeader) {
    return { valid: false, error: 'Missing authorization header' };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Invalid authorization format' };
  }

  const token = authHeader.substring(7);
  if (!token || token.length < 20) {
    return { valid: false, error: 'Invalid token format' };
  }

  return { valid: true };
}

// Log security events (simplified for Edge Functions)
export function logSecurityEvent(
  eventType: string,
  details: any = {},
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
) {
  console.log(`[SECURITY] ${severity.toUpperCase()}: ${eventType}`, {
    timestamp: new Date().toISOString(),
    ...details
  });
}

// Validate file upload data
export function validateFileUpload(fileData: {
  name: string;
  size: number;
  type: string;
}): ValidationResult {
  const errors: string[] = [];
  const { name, size, type } = fileData;

  // Validate file name
  if (!name || typeof name !== 'string') {
    errors.push('Invalid file name');
  } else {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.php$/i, /\.js$/i, /\.html$/i, /\.exe$/i, /\.bat$/i, /\.sh$/i,
      /<script/i, /javascript:/i, /\.\./,
      /[<>:"\\|?*]/
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(name))) {
      errors.push('File name contains suspicious characters');
    }

    // Validate extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.cr2', '.cr3', '.nef', '.arw', '.dng'];
    const extension = '.' + name.toLowerCase().split('.').pop();
    if (!allowedExtensions.includes(extension)) {
      errors.push(`Invalid file extension: ${extension}`);
    }
  }

  // Validate file size (50MB max)
  if (!size || typeof size !== 'number' || size <= 0) {
    errors.push('Invalid file size');
  } else if (size > 50 * 1024 * 1024) {
    errors.push('File too large (max 50MB)');
  }

  // Validate MIME type
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/tiff',
    'image/x-canon-cr2', 'image/x-canon-cr3',
    'image/x-nikon-nef', 'image/x-sony-arw', 'image/x-adobe-dng'
  ];
  
  if (type && !allowedMimeTypes.includes(type)) {
    logSecurityEvent('suspicious_mime_type', { fileName: name, mimeType: type });
  }

  return { valid: errors.length === 0, errors };
}