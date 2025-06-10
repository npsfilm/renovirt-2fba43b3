
/**
 * Secure logging utility
 */
export const secureLog = (message: string, data?: any) => {
  // In development, log everything. In production, be more selective
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SECURE] ${message}`, data);
  } else {
    // Only log important events in production
    if (message.includes('error') || message.includes('failed')) {
      console.error(`[SECURE] ${message}`, data);
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
