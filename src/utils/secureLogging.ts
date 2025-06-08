
export const secureLog = (message: string, data?: any) => {
  console.log(`[SECURE LOG] ${message}`, data);
};

export const logSecurityEvent = (event: string, data?: any) => {
  console.log(`[SECURITY EVENT] ${event}`, data);
};
