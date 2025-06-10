
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';

interface SecurityContextType {
  hasAdminAccess: boolean;
  isSecureSession: boolean;
  refreshSecurity: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType>({
  hasAdminAccess: false,
  isSecureSession: false,
  refreshSecurity: async () => {},
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
      refreshSecurity
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export default EnhancedSecurityProvider;
