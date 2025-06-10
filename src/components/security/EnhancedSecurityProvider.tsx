import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';

interface SecurityContextType {
  hasAdminAccess: boolean;
  isSecureSession: boolean;
  refreshSecurity: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType>({
  hasAdminAccess: false,
  isSecureSession: false,
  refreshSecurity: async () => {},
  checkPermission: () => false,
});

export const useSecurity = () => useContext(SecurityContext);

interface EnhancedSecurityProviderProps {
  children: React.ReactNode;
}

const EnhancedSecurityProvider = ({ children }: EnhancedSecurityProviderProps) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [isSecureSession, setIsSecureSession] = useState(false);

  const checkPermission = (permission: string): boolean => {
    // Basic permission checking - can be extended based on requirements
    if (!user) return false;
    
    switch (permission) {
      case 'file_upload':
        return true; // All authenticated users can upload files
      case 'admin_access':
        return hasAdminAccess;
      default:
        return false;
    }
  };

  const verifyAdminAccess = async () => {
    if (!user || !isAdmin) {
      setHasAdminAccess(false);
      setIsSecureSession(false);
      return;
    }

    try {
      // Verify admin role through RPC function
      const { data, error } = await supabase.rpc('has_admin_role', {
        user_uuid: user.id
      });

      if (error) {
        logSecurityEvent('admin_verification_failed', { 
          userId: user.id, 
          error: error.message 
        });
        setHasAdminAccess(false);
        setIsSecureSession(false);
        return;
      }

      if (data === true) {
        setHasAdminAccess(true);
        setIsSecureSession(true);
        logSecurityEvent('admin_verification_success', { userId: user.id });
      } else {
        logSecurityEvent('admin_verification_denied', { userId: user.id });
        setHasAdminAccess(false);
        setIsSecureSession(false);
      }
    } catch (error) {
      logSecurityEvent('admin_verification_error', { userId: user.id, error });
      setHasAdminAccess(false);
      setIsSecureSession(false);
    }
  };

  const refreshSecurity = async () => {
    await verifyAdminAccess();
  };

  useEffect(() => {
    verifyAdminAccess();
  }, [user, isAdmin]);

  return (
    <SecurityContext.Provider value={{
      hasAdminAccess,
      isSecureSession,
      refreshSecurity,
      checkPermission
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export default EnhancedSecurityProvider;
