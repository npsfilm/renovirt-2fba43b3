
/**
 * Secure logging utilities that avoid exposing sensitive data
 */

const SENSITIVE_KEYS = [
  'password', 'token', 'secret', 'key', 'auth', 'email', 'phone', 'address'
];

export const secureLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, only log critical errors
    return;
  }
  
  if (data) {
    const sanitizedData = sanitizeLogData(data);
    console.log(message, sanitizedData);
  } else {
    console.log(message);
  }
};

const sanitizeLogData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeLogData);
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

export const logSecurityEvent = (event: string, details?: any) => {
  // In a real application, this would send to a security monitoring service
  secureLog(`Security Event: ${event}`, details);
};
