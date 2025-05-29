
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validateUrlTokens, cleanupAuthState, secureSignOut, secureSignIn } from '@/utils/authSecurity';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle email confirmation from URL tokens
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      const search = window.location.search;
      
      if (hash || search) {
        secureLog('Email confirmation detected in useAuth');
        
        try {
          const hashTokens = validateUrlTokens(hash);
          const searchParams = new URLSearchParams(search);
          const accessToken = hashTokens?.accessToken || searchParams.get('access_token');
          const refreshToken = searchParams.get('refresh_token');
          const type = hashTokens?.type || searchParams.get('type');
          
          if (accessToken && (type === 'signup' || type === 'email_confirmation')) {
            secureLog('Processing email confirmation with access token in useAuth');
            
            // Set the session using the tokens from URL
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (error) {
              throw error;
            }
            
            if (data.session) {
              secureLog('Email confirmation successful, session established in useAuth');
              setSession(data.session);
              setUser(data.session.user);
              setLoading(false);
              
              // Clean up the URL for security
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Redirect to onboarding after successful confirmation
              if (window.location.pathname !== '/onboarding') {
                setTimeout(() => {
                  window.location.href = '/onboarding';
                }, 500);
              }
              
              return true;
            }
          }
        } catch (error: any) {
          console.error('Error during email confirmation in useAuth:', error);
          setLoading(false);
        }
      }
      return false;
    };

    // Handle email confirmation first
    handleEmailConfirmation().then((wasEmailConfirmation) => {
      if (!wasEmailConfirmation) {
        // Normal auth state handling
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            secureLog('Auth state changed:', { event, userEmail: session?.user?.email });
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Handle different auth events
            if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
              logSecurityEvent('user_signed_in', { userId: session.user.id });
              
              // Only redirect if we're not already on onboarding page
              if (!window.location.pathname.includes('/onboarding')) {
                // Use setTimeout to defer navigation and prevent deadlocks
                setTimeout(() => {
                  window.location.href = '/onboarding';
                }, 0);
              }
            }
            
            if (event === 'SIGNED_OUT') {
              logSecurityEvent('user_signed_out');
              cleanupAuthState();
            }
          }
        );

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        });

        return () => subscription.unsubscribe();
      }
    });
  }, []);

  const signUp = async (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    try {
      logSecurityEvent('signup_attempt', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });
      
      if (error) {
        logSecurityEvent('signup_failed', { email, error: error.message });
      } else {
        logSecurityEvent('signup_success', { email });
      }
      
      return { data, error };
    } catch (error) {
      logSecurityEvent('signup_error', { email, error });
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      logSecurityEvent('signin_attempt', { email });
      const result = await secureSignIn(email, password);
      
      if (result.error) {
        logSecurityEvent('signin_failed', { email, error: result.error.message });
      } else {
        logSecurityEvent('signin_success', { email });
      }
      
      return result;
    } catch (error) {
      logSecurityEvent('signin_error', { email, error });
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      logSecurityEvent('google_signin_attempt');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      
      if (error) {
        logSecurityEvent('google_signin_failed', { error: error.message });
      }
      
      return { data, error };
    } catch (error) {
      logSecurityEvent('google_signin_error', { error });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      logSecurityEvent('signout_attempt');
      await secureSignOut();
      return { error: null };
    } catch (error) {
      logSecurityEvent('signout_error', { error });
      return { error };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};
