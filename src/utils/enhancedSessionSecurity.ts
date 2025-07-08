import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './secureLogging';
import { generateSessionFingerprint } from './enhancedSecurityValidation';

interface SessionData {
  sessionId: string;
  fingerprint: string;
  lastActivity: number;
  userId?: string;
  isValid: boolean;
}

// Enhanced session management with fingerprinting
const sessionStore = new Map<string, SessionData>();

export const createSecureSession = (userId?: string): string => {
  const sessionId = crypto.randomUUID();
  const fingerprint = generateSessionFingerprint();
  
  const sessionData: SessionData = {
    sessionId,
    fingerprint,
    lastActivity: Date.now(),
    userId,
    isValid: true
  };

  sessionStore.set(sessionId, sessionData);
  
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('renovirt_session_id', sessionId);
    localStorage.setItem('renovirt_session_fingerprint', fingerprint);
  }

  logSecurityEvent('session_created', { sessionId, userId, fingerprint: fingerprint.substring(0, 8) });
  
  return sessionId;
};

export const validateSession = (sessionId: string): boolean => {
  const session = sessionStore.get(sessionId);
  
  if (!session || !session.isValid) {
    return false;
  }

  // Check if session expired (24 hours)
  const maxAge = 24 * 60 * 60 * 1000;
  if (Date.now() - session.lastActivity > maxAge) {
    invalidateSession(sessionId);
    return false;
  }

  // Validate fingerprint
  const currentFingerprint = generateSessionFingerprint();
  if (session.fingerprint !== currentFingerprint) {
    logSecurityEvent('session_fingerprint_mismatch', { 
      sessionId, 
      expected: session.fingerprint.substring(0, 8),
      received: currentFingerprint.substring(0, 8)
    });
    invalidateSession(sessionId);
    return false;
  }

  // Update last activity
  session.lastActivity = Date.now();
  
  return true;
};

export const invalidateSession = (sessionId: string, reason: string = 'manual'): void => {
  const session = sessionStore.get(sessionId);
  
  if (session) {
    session.isValid = false;
    logSecurityEvent('session_invalidated', { sessionId, reason, userId: session.userId });
  }

  sessionStore.delete(sessionId);
  
  // Clear from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('renovirt_session_id');
    localStorage.removeItem('renovirt_session_fingerprint');
  }
};

export const getCurrentSession = (): SessionData | null => {
  if (typeof window === 'undefined') return null;
  
  const sessionId = localStorage.getItem('renovirt_session_id');
  if (!sessionId) return null;

  const session = sessionStore.get(sessionId);
  if (!session) return null;

  if (!validateSession(sessionId)) {
    return null;
  }

  return session;
};

// Enhanced auth state cleanup with session management
export const cleanupAuthStateEnhanced = (): void => {
  // Get current session before cleanup
  const currentSession = getCurrentSession();
  if (currentSession) {
    invalidateSession(currentSession.sessionId, 'auth_cleanup');
  }

  // Clear all Supabase auth keys
  if (typeof window !== 'undefined') {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('renovirt_session')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('renovirt_session')) {
        sessionStorage.removeItem(key);
      }
    });

    // Clear other potential auth-related storage
    ['auth-token', 'access_token', 'refresh_token', 'user_session'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  logSecurityEvent('auth_state_cleanup_complete');
};

// Session monitoring and automatic cleanup
export const startSessionMonitoring = (): void => {
  if (typeof window === 'undefined') return;

  // Monitor for tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const session = getCurrentSession();
      if (session) {
        logSecurityEvent('session_tab_hidden', { sessionId: session.sessionId });
      }
    }
  });

  // Monitor for beforeunload
  window.addEventListener('beforeunload', () => {
    const session = getCurrentSession();
    if (session) {
      logSecurityEvent('session_page_unload', { sessionId: session.sessionId });
    }
  });

  // Periodic session validation
  setInterval(() => {
    const session = getCurrentSession();
    if (session && !validateSession(session.sessionId)) {
      cleanupAuthStateEnhanced();
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  // Cleanup expired sessions
  setInterval(() => {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000;

    for (const [sessionId, session] of sessionStore.entries()) {
      if (now - session.lastActivity > maxAge) {
        invalidateSession(sessionId, 'expired');
      }
    }
  }, 60 * 60 * 1000); // Check every hour
};

// Initialize session monitoring when module is loaded
if (typeof window !== 'undefined') {
  startSessionMonitoring();
}