
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useInactivityLogout = () => {
  const { user, signOut } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (user) {
      lastActivityRef.current = Date.now();
      timeoutRef.current = setTimeout(async () => {
        console.log('User inactive for 30 minutes, logging out...');
        await signOut();
      }, INACTIVITY_TIMEOUT);
    }
  };

  const handleActivity = () => {
    if (user) {
      resetTimer();
    }
  };

  useEffect(() => {
    if (!user) {
      // Clear timer if user is not logged in
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Set up initial timer
    resetTimer();

    // Activity events to track
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user]);

  // Also reset timer when user changes (login/logout)
  useEffect(() => {
    if (user) {
      resetTimer();
    }
  }, [user]);
};
