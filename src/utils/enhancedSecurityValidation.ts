import { sanitizeInput, validateEmail } from './inputValidation';
import { secureLog, logSecurityEvent } from './secureLogging';
import { supabase } from '@/integrations/supabase/client';

// Enhanced file upload validation with server-side verification
export const validateFileUploadSecurity = (file: File, userId?: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push(`Datei "${file.name}" ist zu groß (max. 50MB)`);
  }

  // Check minimum file size (prevent empty files)
  if (file.size < 100) {
    errors.push(`Datei "${file.name}" ist zu klein (min. 100 Bytes)`);
  }

  // Validate file extension against whitelist
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.cr2', '.cr3', '.nef', '.arw', '.dng'];
  const fileExtension = '.' + file.name.toLowerCase().split('.').pop();
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(`Datei "${file.name}" hat eine ungültige Erweiterung. Erlaubt: ${allowedExtensions.join(', ')}`);
  }

  // Validate MIME type against whitelist
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/tiff', 'image/x-canon-cr2', 
    'image/x-canon-cr3', 'image/x-nikon-nef', 'image/x-sony-arw', 'image/x-adobe-dng'
  ];
  if (file.type && !allowedMimeTypes.includes(file.type)) {
    logSecurityEvent('suspicious_mime_type', { 
      fileName: file.name, 
      mimeType: file.type,
      userId 
    });
  }

  // Check for suspicious file names and patterns
  const suspiciousPatterns = [
    /\.php$/i, /\.js$/i, /\.html$/i, /\.exe$/i, /\.bat$/i, /\.sh$/i,
    /<script/i, /javascript:/i, /vbscript:/i, /onload=/i, /onerror=/i,
    /\.\./,  // Directory traversal
    /[<>:"\\|?*]/,  // Invalid filename characters
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    logSecurityEvent('suspicious_file_upload_attempt', { 
      fileName: file.name, 
      userId,
      fileType: file.type,
      severity: 'high'
    });
    errors.push(`Datei "${file.name}" enthält verdächtige Zeichen`);
  }

  // Check for double extensions (e.g., image.jpg.exe)
  const parts = file.name.split('.');
  if (parts.length > 2) {
    const secondExtension = parts[parts.length - 2];
    const executableExtensions = ['exe', 'bat', 'cmd', 'com', 'scr', 'pif', 'vbs', 'js', 'jar'];
    if (executableExtensions.includes(secondExtension.toLowerCase())) {
      errors.push(`Datei "${file.name}" hat verdächtige Doppelerweiterung`);
    }
  }

  return { valid: errors.length === 0, errors };
};

// Enhanced admin operation validation with database rate limiting
export const validateAdminOperation = async (
  operation: string, 
  userId: string, 
  targetResource?: string,
  additionalData?: any
): Promise<{ valid: boolean; error?: string }> => {
  try {
    // Check database-backed rate limiting
    const { data: canProceed, error } = await supabase.rpc('check_rate_limit', {
      identifier: `admin_op_${userId}_${operation}`,
      max_requests: 50, // 50 operations per hour
      window_seconds: 3600
    });

    if (error) {
      logSecurityEvent('rate_limit_check_failed', { operation, userId, error: error.message });
      return { valid: false, error: 'Sicherheitsprüfung fehlgeschlagen' };
    }

    if (!canProceed) {
      logSecurityEvent('admin_operation_rate_limited', { 
        operation, 
        userId, 
        targetResource,
        severity: 'high'
      });
      return { valid: false, error: 'Zu viele Verwaltungsoperationen. Bitte warten Sie eine Stunde.' };
    }

    // Log admin operation attempt
    await supabase.rpc('audit_admin_action', {
      action_type: operation,
      table_name: targetResource || 'unknown',
      details: additionalData || {}
    });

    return { valid: true };
  } catch (error) {
    logSecurityEvent('admin_validation_error', { operation, userId, error });
    return { valid: false, error: 'Validierung fehlgeschlagen' };
  }
};

// Enhanced password validation with entropy checking
export const validatePasswordStrength = (password: string): { 
  valid: boolean; 
  errors: string[];
  score: number;
  entropy: number;
} => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 12) {
    errors.push('Passwort muss mindestens 12 Zeichen lang sein');
  } else if (password.length >= 16) {
    score += 3;
  } else {
    score += 2;
  }

  // Character variety checks
  const checks = [
    { pattern: /[a-z]/, message: 'Passwort muss mindestens einen Kleinbuchstaben enthalten', points: 1 },
    { pattern: /[A-Z]/, message: 'Passwort muss mindestens einen Großbuchstaben enthalten', points: 1 },
    { pattern: /[0-9]/, message: 'Passwort muss mindestens eine Zahl enthalten', points: 1 },
    { pattern: /[^a-zA-Z0-9]/, message: 'Passwort muss mindestens ein Sonderzeichen enthalten', points: 2 }
  ];

  checks.forEach(check => {
    if (check.pattern.test(password)) {
      score += check.points;
    } else {
      errors.push(check.message);
    }
  });

  // Calculate entropy
  const entropy = calculatePasswordEntropy(password);
  if (entropy < 50) {
    errors.push('Passwort ist zu vorhersagbar');
  } else if (entropy >= 60) {
    score += 2;
  } else if (entropy >= 50) {
    score += 1;
  }

  // Check for common patterns and passwords
  const commonPatterns = [
    /123456/, /password/i, /qwerty/i, /admin/i, /letmein/i,
    /welcome/i, /monkey/i, /dragon/i, /master/i, /sunshine/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Passwort enthält häufig verwendete Muster');
    score = Math.max(0, score - 3);
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Passwort enthält zu viele wiederholte Zeichen');
    score = Math.max(0, score - 1);
  }

  return { 
    valid: errors.length === 0 && score >= 5, 
    errors, 
    score: Math.min(score, 10),
    entropy 
  };
};

// Calculate password entropy
const calculatePasswordEntropy = (password: string): number => {
  const charsets = [
    { pattern: /[a-z]/, size: 26 },
    { pattern: /[A-Z]/, size: 26 },
    { pattern: /[0-9]/, size: 10 },
    { pattern: /[^a-zA-Z0-9]/, size: 32 }
  ];

  let charsetSize = 0;
  charsets.forEach(charset => {
    if (charset.pattern.test(password)) {
      charsetSize += charset.size;
    }
  });

  return password.length * Math.log2(charsetSize);
};

// Input sanitization with XSS protection
export const sanitizeUserInput = (input: string, allowedTags: string[] = []): string => {
  if (!input || typeof input !== 'string') return '';

  // Remove or encode potentially dangerous content
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:/gi, '') // Remove data: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers

  // If no tags are allowed, strip all HTML
  if (allowedTags.length === 0) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Encode remaining special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return sanitized.trim();
};

// Session fingerprint generation for additional security
export const generateSessionFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.platform
  ];

  const fingerprint = components.join('|');
  
  // Create hash of fingerprint
  return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
};

// Export from existing file to maintain compatibility
export { cleanupRateLimitStore } from './enhancedInputValidation';