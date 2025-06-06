
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { logSecurityEvent } from '@/utils/secureLogging';

const SecurityMonitor = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Track page visibility changes (potential security indicator)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent('page_hidden', { userId: user?.id });
      } else {
        logSecurityEvent('page_visible', { userId: user?.id });
      }
    };

    // Track failed authentication attempts
    const trackFailedAuth = () => {
      const failedAttempts = parseInt(sessionStorage.getItem('failed_auth_attempts') || '0');
      if (failedAttempts > 3) {
        logSecurityEvent('multiple_failed_auth_attempts', { 
          attempts: failedAttempts,
          timestamp: Date.now()
        });
      }
    };

    // Monitor for suspicious activity patterns
    const monitorActivity = () => {
      const activityCount = parseInt(sessionStorage.getItem('activity_count') || '0');
      const lastActivity = parseInt(sessionStorage.getItem('last_activity') || '0');
      const now = Date.now();

      // Reset counter every 5 minutes
      if (now - lastActivity > 300000) {
        sessionStorage.setItem('activity_count', '1');
      } else {
        const newCount = activityCount + 1;
        sessionStorage.setItem('activity_count', newCount.toString());
        
        // Log if unusually high activity
        if (newCount > 100) {
          logSecurityEvent('high_activity_detected', { 
            activityCount: newCount,
            userId: user?.id 
          });
        }
      }
      
      sessionStorage.setItem('last_activity', now.toString());
    };

    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Monitor activity
    const activityInterval = setInterval(monitorActivity, 30000); // Every 30 seconds
    const authCheckInterval = setInterval(trackFailedAuth, 60000); // Every minute

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(activityInterval);
      clearInterval(authCheckInterval);
    };
  }, [user]);

  return null; // This component doesn't render anything
};

export default SecurityMonitor;
