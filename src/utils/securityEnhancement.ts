
interface FileValidationResult {
  valid: boolean;
  errors: string[];
}

const supportedFormats = ['jpg', 'jpeg', 'png', 'cr2', 'cr3', 'nef', 'arw', 'dng', 'zip'];
const maxFileSize = 25 * 1024 * 1024; // 25MB

export const validateFileSecurely = (file: File): FileValidationResult => {
  const errors: string[] = [];
  
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !supportedFormats.includes(extension)) {
    errors.push('Ungültiges Dateiformat');
  }
  
  // Check file size
  if (file.size > maxFileSize) {
    errors.push('Datei zu groß (max. 25MB)');
  }
  
  // Check for empty file
  if (file.size === 0) {
    errors.push('Datei ist leer');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const enhancedRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
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

export const verifyAdminRole = async (userId: string): Promise<boolean> => {
  // This would typically check with backend
  // For now, return false as a safe default
  return false;
};
