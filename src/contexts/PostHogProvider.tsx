import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import posthog from 'posthog-js';

interface PostHogContextType {
  posthog: typeof posthog;
}

const PostHogContext = createContext<PostHogContextType | null>(null);

interface PostHogProviderProps {
  children: ReactNode;
}

export const PostHogProvider = ({ children }: PostHogProviderProps) => {
  useEffect(() => {
    // Only initialize in production or when explicitly enabled
    if (import.meta.env.PROD) {
      posthog.init('phc_g48F40A2phnQpu0sbg219nYkpIbnfKAHvq4COruVWhS', {
        api_host: 'https://eu.posthog.com',
        autocapture: true,
        capture_pageview: true,
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: '[data-sensitive]',
          recordCrossOriginIframes: false,
        },
        loaded: (posthog) => {
          if (import.meta.env.DEV) posthog.debug();
        }
      });
    } else {
      // Disable in development
      posthog.init('phc_g48F40A2phnQpu0sbg219nYkpIbnfKAHvq4COruVWhS', {
        api_host: 'https://eu.posthog.com',
        autocapture: false,
        capture_pageview: false,
        disable_session_recording: true,
        loaded: (posthog) => {
          posthog.debug();
          posthog.opt_out_capturing();
        }
      });
    }

    return () => {
      posthog.reset();
    };
  }, []);

  return (
    <PostHogContext.Provider value={{ posthog }}>
      {children}
    </PostHogContext.Provider>
  );
};

export const usePostHog = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }
  return context.posthog;
};

// Optional hook that returns null if PostHogProvider is not mounted
export const useOptionalPostHog = () => {
  const context = useContext(PostHogContext);
  return context?.posthog ?? null;
};