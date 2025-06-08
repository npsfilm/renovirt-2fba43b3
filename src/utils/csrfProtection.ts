
export const withCSRFProtection = <T>(data: T): T => {
  // Add CSRF token if needed
  return {
    ...data,
    _csrf: 'protected'
  };
};
