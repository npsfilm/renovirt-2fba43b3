
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const withCSRFProtection = <T>(data: T): T => {
  // Add CSRF token if needed
  return {
    ...data,
    _csrf: generateCSRFToken()
  };
};
