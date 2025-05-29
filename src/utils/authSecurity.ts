
import { supabase } from '@/integrations/supabase/client';

/**
 * Cleanup authentication state to prevent limbo states
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Safely validate and sanitize URL hash parameters
 */
export const validateUrlTokens = (hash: string) => {
  try {
    const urlParams = new URLSearchParams(hash.substring(1));
    const accessToken = urlParams.get('access_token');
    const type = urlParams.get('type');
    
    // Validate token format (basic check)
    if (accessToken && typeof accessToken === 'string' && accessToken.length > 10) {
      // Additional validation for token format
      const tokenPattern = /^[A-Za-z0-9\-_.]+$/;
      if (!tokenPattern.test(accessToken)) {
        console.warn('Invalid token format detected');
        return null;
      }
      
      return { accessToken, type };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    return null;
  }
};

/**
 * Secure logging utility
 */
export const secureLog = (message: string, data?: any) => {
  // In development, log everything. In production, be more selective
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH] ${message}`, data);
  } else {
    // Only log important events in production
    if (message.includes('error') || message.includes('failed')) {
      console.error(`[AUTH] ${message}`, data);
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

/**
 * Secure sign out with proper cleanup
 */
export const secureSignOut = async () => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
      console.warn('Global sign out failed, continuing with cleanup');
    }
    
    // Force page reload for clean state
    window.location.href = '/auth';
  } catch (error) {
    console.error('Error during sign out:', error);
    // Fallback - still redirect to clean state
    window.location.href = '/auth';
  }
};

/**
 * Secure sign in with proper cleanup
 */
export const secureSignIn = async (email: string, password: string) => {
  try {
    // Clean up existing state
    cleanupAuthState();
    
    // Attempt global sign out to ensure clean state
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      // Continue even if this fails
    }
    
    // Sign in with email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
