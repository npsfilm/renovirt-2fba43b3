
/**
 * Secure logging utility with proper Vite environment handling
 */
export const secureLog = (message: string, data?: any) => {
  // Use Vite's import.meta.env instead of process.env
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  // In development, log everything with detailed information
  if (isDevelopment) {
    console.log(`[SECURE] ${message}`, data);
  } else if (isProduction) {
    // In production, be selective about what gets logged
    // Only log errors, warnings, and critical security events
    if (message.includes('error') || 
        message.includes('failed') || 
        message.includes('Security Event') ||
        message.includes('critical') ||
        message.includes('warning')) {
      // Use appropriate log level based on message content
      if (message.includes('error') || message.includes('failed')) {
        console.error(`[SECURE] ${message}`, data);
      } else if (message.includes('warning')) {
        console.warn(`[SECURE] ${message}`, data);
      } else {
        console.log(`[SECURE] ${message}`, data);
      }
    }
  }
};

/**
 * Security event logging
 */
export const logSecurityEvent = (event: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logData = {
    event,
    timestamp,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...data
  };
  
  // In production, you might want to send this to a monitoring service
  secureLog(`Security Event: ${event}`, logData);
};
