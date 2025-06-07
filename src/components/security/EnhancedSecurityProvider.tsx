
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { verifyAdminRole, enhancedRateLimit } from '@/utils/securityEnhancement';
import { logSecurityEvent } from '@/utils/secureLogging';

interface SecurityContextType {
  isSecureSession: boolean;
  hasAdminAccess: boolean;
  refreshSecurity: () => Promise<void>;
  checkPermission: (action: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecureSession: false,
  hasAdminAccess: false,
  refreshSecurity: async () => {},
  checkPermission: () => false,
});

export const useSecurity = () => useContext(SecurityContext);

interface EnhancedSecurityProviderProps {
  children: React.ReactNode;
}

const EnhancedSecurityProvider = ({ children }: EnhancedSecurityProviderProps) => {
  const { user } = useAuth();
  const [isSecureSession, setIsSecureSession] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  const refreshSecurity = async () => {
    if (!user) {
      setIsSecureSession(false);
      setHasAdminAccess(false);
      return;
    }

    try {
      setIsSecureSession(true);
      
      // Check admin access with enhanced security
      const adminAccess = await verifyAdminRole(user.id);
      setHasAdminAccess(adminAccess);
      
      logSecurityEvent('security_context_refreshed', { 
        userId: user.id, 
        hasAdminAccess: adminAccess 
      });
    } catch (error) {
      logSecurityEvent('security_context_error', { userId: user.id, error });
      setIsSecureSession(false);
      setHasAdminAccess(false);
    }
  };

  const checkPermission = (action: string): boolean => {
    if (!user || !isSecureSession) return false;

    // Rate limit permission checks
    if (!enhancedRateLimit(`permission_${user.id}_${action}`, 100, 60000)) {
      logSecurityEvent('permission_check_rate_limited', { userId: user.id, action });
      return false;
    }

    // Basic permission logic - can be extended
    switch (action) {
      case 'admin_access':
        return hasAdminAccess;
      case 'file_upload':
        return isSecureSession;
      case 'create_order':
        return isSecureSession;
      default:
        return isSecureSession;
    }
  };

  useEffect(() => {
    refreshSecurity();
    
    // Refresh security context every 5 minutes
    const interval = setInterval(refreshSecurity, 300000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <SecurityContext.Provider value={{
      isSecureSession,
      hasAdminAccess,
      refreshSecurity,
      checkPermission
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export default EnhancedSecurityProvider;
