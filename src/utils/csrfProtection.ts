
export const generateCSRFToken = (): string => {
  // Use cryptographically secure random number generation
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

interface CSRFTokenData {
  token: string;
  expires: number;
  sessionId: string;
}

// Store CSRF tokens with expiration
const csrfTokenStore = new Map<string, CSRFTokenData>();

export const generateSecureCSRFToken = (sessionId?: string): { token: string; expires: number } => {
  const token = generateCSRFToken();
  const expires = Date.now() + (30 * 60 * 1000); // 30 minutes
  const session = sessionId || crypto.randomUUID();
  
  csrfTokenStore.set(token, { token, expires, sessionId: session });
  
  // Cleanup expired tokens
  cleanupExpiredTokens();
  
  return { token, expires };
};

export const validateCSRFToken = (token: string, sessionId?: string): boolean => {
  const tokenData = csrfTokenStore.get(token);
  
  if (!tokenData) return false;
  if (tokenData.expires < Date.now()) {
    csrfTokenStore.delete(token);
    return false;
  }
  if (sessionId && tokenData.sessionId !== sessionId) return false;
  
  // Single use token - remove after validation
  csrfTokenStore.delete(token);
  return true;
};

const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const [token, data] of csrfTokenStore.entries()) {
    if (data.expires < now) {
      csrfTokenStore.delete(token);
    }
  }
};

export const withCSRFProtection = <T>(data: T, sessionId?: string): T => {
  const { token } = generateSecureCSRFToken(sessionId);
  return {
    ...data,
    _csrf: token
  };
};
