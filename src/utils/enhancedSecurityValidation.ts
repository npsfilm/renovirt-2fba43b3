
import { sanitizeInput, validateEmail } from './inputValidation';
import { secureLog, logSecurityEvent } from './secureLogging';

// Enhanced referral code validation
export const validateReferralCode = (code: string): { valid: boolean; error?: string } => {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Referral code is required' };
  }

  // Remove any whitespace and convert to uppercase
  const cleanCode = code.trim().toUpperCase();

  // Check format: exactly 8 alphanumeric characters
  const codePattern = /^[A-Z0-9]{8}$/;
  if (!codePattern.test(cleanCode)) {
    logSecurityEvent('invalid_referral_code_format', { code: code.substring(0, 3) + '***' });
    return { valid: false, error: 'Ungültiges Empfehlungscode-Format (8 Zeichen erforderlich)' };
  }

  // Check for suspicious patterns (consecutive identical characters)
  const consecutivePattern = /(.)\1{3,}/;
  if (consecutivePattern.test(cleanCode)) {
    logSecurityEvent('suspicious_referral_code_pattern', { code: cleanCode.substring(0, 3) + '***' });
    return { valid: false, error: 'Ungültiges Empfehlungscode-Format' };
  }

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

// Import from existing file to avoid duplication
export { checkRateLimit, cleanupRateLimitStore } from './enhancedInputValidation';
