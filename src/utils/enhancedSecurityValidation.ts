import { sanitizeInput, validateEmail } from './inputValidation';
import { secureLog, logSecurityEvent } from './secureLogging';
import { checkRateLimit } from './enhancedInputValidation';

// Enhanced referral code validation - made more flexible
export const validateReferralCode = (code: string): { valid: boolean; error?: string } => {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Referral code is required' };
  }

  // Remove any whitespace and convert to uppercase
  const cleanCode = code.trim().toUpperCase();

  // Check minimum length (at least 4 characters)
  if (cleanCode.length < 4) {
    return { valid: false, error: 'Empfehlungscode muss mindestens 4 Zeichen lang sein' };
  }

  // Check maximum length (max 12 characters to be flexible)
  if (cleanCode.length > 12) {
    return { valid: false, error: 'Empfehlungscode darf maximal 12 Zeichen lang sein' };
  }

  // Check format: only alphanumeric characters allowed
  const codePattern = /^[A-Z0-9]+$/;
  if (!codePattern.test(cleanCode)) {
    return { valid: false, error: 'Empfehlungscode darf nur Buchstaben und Zahlen enthalten' };
  }

  // Remove the overly strict consecutive character check
  // This was too restrictive for real referral codes

  return { valid: true };
};

// Enhanced file upload validation
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

  // Validate file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif'];
  const fileExtension = file.name.toLowerCase().split('.').pop();
  if (!fileExtension || !allowedExtensions.includes('.' + fileExtension)) {
    errors.push(`Datei "${file.name}" hat eine ungültige Erweiterung. Erlaubt: ${allowedExtensions.join(', ')}`);
  }

  // Validate MIME type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/tiff'];
  if (!allowedMimeTypes.includes(file.type)) {
    errors.push(`Datei "${file.name}" hat einen ungültigen MIME-Typ`);
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.php$/i, /\.js$/i, /\.html$/i, /\.exe$/i, /\.bat$/i, /\.sh$/i,
    /<script/i, /javascript:/i, /vbscript:/i, /onload=/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    logSecurityEvent('suspicious_file_upload_attempt', { 
      fileName: file.name, 
      userId,
      fileType: file.type 
    });
    errors.push(`Datei "${file.name}" enthält verdächtige Zeichen`);
  }

  return { valid: errors.length === 0, errors };
};

// Enhanced admin operation validation
export const validateAdminOperation = (
  operation: string, 
  userId: string, 
  targetResource?: string
): { valid: boolean; error?: string } => {
  // Rate limiting for admin operations
  const rateLimitKey = `admin_op_${userId}_${operation}`;
  if (!checkRateLimit(rateLimitKey, 100, 3600000)) { // 100 operations per hour
    logSecurityEvent('admin_operation_rate_limited', { 
      operation, 
      userId, 
      targetResource 
    });
    return { valid: false, error: 'Zu viele Verwaltungsoperationen. Bitte warten Sie.' };
  }

  // Log admin operations
  logSecurityEvent('admin_operation_attempted', { 
    operation, 
    userId, 
    targetResource 
  });

  return { valid: true };
};

// Enhanced password validation
export const validatePasswordStrength = (password: string): { 
  valid: boolean; 
  errors: string[];
  score: number;
} => {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Passwort muss mindestens 8 Zeichen lang sein');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Kleinbuchstaben enthalten');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Passwort muss mindestens einen Großbuchstaben enthalten');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Passwort muss mindestens eine Zahl enthalten');
  } else {
    score += 1;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Passwort muss mindestens ein Sonderzeichen enthalten');
  } else {
    score += 2;
  }

  // Check for common patterns
  const commonPatterns = [
    /123456/, /password/i, /qwerty/i, /admin/i, /letmein/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Passwort enthält häufig verwendete Muster');
    score = Math.max(0, score - 2);
  }

  return { 
    valid: errors.length === 0, 
    errors, 
    score: Math.min(score, 7) 
  };
};

// Export from existing file to avoid duplication
export { cleanupRateLimitStore } from './enhancedInputValidation';
