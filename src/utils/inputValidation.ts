
export const sanitizeFilename = (filename: string): string => {
  // Remove dangerous characters and limit length
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 255);
};

export const validateAndSanitizeText = (text: string, maxLength: number = 1000): string => {
  return text.substring(0, maxLength).replace(/[<>]/g, '');
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
