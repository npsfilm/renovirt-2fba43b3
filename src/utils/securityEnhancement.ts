
/**
 * Enhanced security utilities for comprehensive protection
 */

import { supabase } from '@/integrations/supabase/client';
import { secureLog, logSecurityEvent } from './secureLogging';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const enhancedRateLimit = (
  key: string, 
  maxAttempts: number, 
  windowMs: number
): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    logSecurityEvent('rate_limit_exceeded', { key, attempts: record.count });
    return false;
  }

  record.count++;
  return true;
};

// Enhanced file validation
export const validateFileSecurely = (file: File): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // File size validation (50MB max)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push(`File too large: ${Math.round(file.size / 1024 / 1024)}MB (max 50MB)`);
  }

  // Minimum size check (prevent empty files)
  if (file.size < 100) {
    errors.push('File too small (minimum 100 bytes)');
  }

  // Strict file type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type: ${file.type}`);
  }

  // File extension validation
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp'];
  const extension = file.name.toLowerCase().split('.').pop();
  if (!extension || !allowedExtensions.includes('.' + extension)) {
    errors.push(`Invalid file extension: .${extension}`);
  }

  // Filename security check
  const suspiciousPatterns = [
    /\.php$/i, /\.js$/i, /\.html$/i, /\.exe$/i, /\.bat$/i, /\.sh$/i,
    /<script/i, /javascript:/i, /vbscript:/i, /onload=/i, /\.\./, /[<>"|*?]/
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('Suspicious characters in filename');
    logSecurityEvent('suspicious_filename_detected', { filename: file.name });
  }

  return { valid: errors.length === 0, errors };
};

// Admin role verification with enhanced security
export const verifyAdminRole = async (userId: string): Promise<boolean> => {
  try {
    // Rate limit admin verifications
    if (!enhancedRateLimit(`admin_verify_${userId}`, 10, 300000)) {
      logSecurityEvent('admin_verification_rate_limited', { userId });
      return false;
    }

    const { data, error } = await supabase.rpc('has_admin_role', {
      user_uuid: userId
    });

    if (error) {
      logSecurityEvent('admin_verification_error', { userId, error: error.message });
      return false;
    }

    if (data) {
      logSecurityEvent('admin_verification_success', { userId });
    } else {
      logSecurityEvent('admin_verification_failed', { userId });
    }

    return data === true;
  } catch (error) {
    logSecurityEvent('admin_verification_exception', { userId, error });
    return false;
  }
};

// Input sanitization for AI prompts
export const sanitizeAIInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potential injection attempts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:(?!image\/)/gi, '')
    .trim()
    .substring(0, 10000); // Limit length
};

// Enhanced payment validation
export const validatePaymentRequest = (amount: number, userId: string): { valid: boolean; error?: string } => {
  // Rate limit payment attempts
  if (!enhancedRateLimit(`payment_${userId}`, 5, 300000)) {
    return { valid: false, error: 'Too many payment attempts. Please wait 5 minutes.' };
  }

  // Amount validation
  if (!amount || amount <= 0) {
    return { valid: false, error: 'Invalid payment amount' };
  }

  if (amount > 10000) { // 100 EUR max per transaction
    logSecurityEvent('suspicious_high_payment_amount', { userId, amount });
    return { valid: false, error: 'Payment amount too high' };
  }

  return { valid: true };
};

// Cleanup old rate limit entries
export const cleanupRateLimitStore = () => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 300000);
