import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validateUrlTokens, cleanupAuthState, secureSignOut, secureSignIn, secureEmailConfirmation } from '@/utils/authSecurity';
import { createSecureSession, validateSession } from '@/utils/enhancedSessionSecurity';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';
import { usePostHog } from '@/contexts/PostHogProvider';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Safe PostHog access with error handling
  const getSafePostHog = () => {
    try {
      return usePostHog();
    } catch (error) {
      console.warn('PostHog not available:', error);
      return null;
    }
  };

  useEffect(() => {
    // Handle email confirmation from URL tokens with security validation
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
            secureLog('Processing email confirmation with security validation');
            
            // Use secure email confirmation with validation
            const confirmedSession = await secureEmailConfirmation(accessToken, refreshToken || undefined);
            
            if (confirmedSession) {
              secureLog('Email confirmation successful, session established securely');
              
              // Create secure session with fingerprinting
              createSecureSession(confirmedSession.user.id);
              
              setSession(confirmedSession);
              setUser(confirmedSession.user);
              setLoading(false);
              
              // Clean up the URL for security
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Redirect to auth page to handle profile completeness check
              if (window.location.pathname !== '/auth') {
                setTimeout(() => {
                  window.location.href = '/auth';
                }, 500);
              }
              
              return true;
            }
          }
        } catch (error: any) {
          console.error('Error during secure email confirmation:', error);
          logSecurityEvent('email_confirmation_error', { 
            error: error.message,
            url: window.location.href
          });
          
          // Redirect to email verification with error
          const errorMessage = encodeURIComponent(error.message || 'E-Mail-Bestätigung fehlgeschlagen');
          window.location.href = `/email-verification?error=${errorMessage}`;
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
              
              // PostHog: Identify user and track sign in (safe)
              const posthog = getSafePostHog();
              if (posthog) {
                try {
                  posthog.identify(session.user.id, {
                    email: session.user.email,
                    email_verified: session.user.email_confirmed_at ? true : false,
                    created_at: session.user.created_at,
                    last_sign_in: session.user.last_sign_in_at
                  });
                  
                  posthog.capture('user_signed_in', {
                    provider: session.user.app_metadata?.provider || 'email',
                    method: event === 'SIGNED_IN' ? 'login' : 'signup'
                  });
                } catch (error) {
                  console.warn('PostHog tracking failed:', error);
                }
              }
              
              // Don't automatically redirect to onboarding - let the Auth component handle profile checks
              // Only redirect if we're on the auth page
              if (window.location.pathname === '/auth') {
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 0);
              }
            }
            
            if (event === 'SIGNED_OUT') {
              logSecurityEvent('user_signed_out');
              
              // PostHog: Track sign out and reset session (safe)
              const posthog = getSafePostHog();
              if (posthog) {
                try {
                  posthog.capture('user_signed_out');
                  posthog.reset();
                } catch (error) {
                  console.warn('PostHog sign out tracking failed:', error);
                }
              }
              
              cleanupAuthState();
            }
          }
        );

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // PostHog: Identify existing user if session exists (safe)
          if (session?.user) {
            const posthog = getSafePostHog();
            if (posthog) {
              try {
                posthog.identify(session.user.id, {
                  email: session.user.email,
                  email_verified: session.user.email_confirmed_at ? true : false,
                  created_at: session.user.created_at,
                  last_sign_in: session.user.last_sign_in_at
                });
              } catch (error) {
                console.warn('PostHog user identification failed:', error);
              }
            }
          }
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
      
      // Korrekte emailRedirectTo URL für die Produktionsumgebung
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/onboarding`;
      
      console.log('SignUp with redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          },
          emailRedirectTo: redirectUrl,
        },
      });
      
      if (error) {
        logSecurityEvent('signup_failed', { email, error: error.message });
        console.error('SignUp error:', error);
      } else if (data.user) {
        logSecurityEvent('signup_success', { email });
        console.log('SignUp successful, redirect URL set to:', redirectUrl);
        console.log('Profile will be created during onboarding process');
        
        // Send custom verification email if user is not yet confirmed
        if (!data.user.email_confirmed_at) {
          try {
            console.log('Sending custom verification email for:', email);
            const { error: emailError } = await supabase.functions.invoke('resend-verification-email', {
              body: { 
                email,
                firstName: userData.firstName,
                lastName: userData.lastName 
              }
            });
            
            if (emailError) {
              console.warn('Custom email sending failed, using default:', emailError);
            } else {
              console.log('Custom verification email sent successfully');
            }
          } catch (emailError) {
            console.warn('Custom email error:', emailError);
          }
        }
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
      
      // Korrekte redirectTo URL für Google OAuth
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/auth`;
      
      console.log('Google signIn with redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) {
        logSecurityEvent('google_signin_failed', { error: error.message });
        console.error('Google signIn error:', error);
      } else {
        console.log('Google signIn initiated, redirect URL set to:', redirectUrl);
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

  // Update email function
  const updateEmail = async (newEmail: string) => {
    console.log('useAuth: Starting email update to:', newEmail);
    
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      
      if (error) throw error;
      
      console.log('useAuth: Email update successful');
      return { success: true };
    } catch (error) {
      console.error('useAuth: Email update failed:', error);
      throw error;
    }
  };

  // Enhanced resend verification email function
  const resendVerificationEmail = async (email: string) => {
    try {
      console.log('Enhanced resend verification email for:', email);
      
      // Try custom edge function first for immediate delivery
      const { data, error } = await supabase.functions.invoke('resend-verification-email', {
        body: { 
          email,
          firstName: user?.user_metadata?.first_name,
          lastName: user?.user_metadata?.last_name
        }
      });

      if (error) {
        console.warn('Custom resend failed, falling back to Supabase:', error);
        
        // Fallback to Supabase's built-in method
        const fallbackResult = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });
        
        return fallbackResult;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Custom email service failed');
      }

      return { data, error: null };
    } catch (error) {
      console.error('Enhanced resend verification failed:', error);
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
    updateEmail,
    resendVerificationEmail,
  };
};
