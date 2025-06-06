
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { supabase } from '@/integrations/supabase/client';
import { secureLog, logSecurityEvent } from '@/utils/secureLogging';
import { checkRateLimit } from '@/utils/enhancedInputValidation';

interface AdminSecurityContextType {
  isSecureAdmin: boolean;
  adminSessionValid: boolean;
  refreshAdminSession: () => Promise<void>;
}

const AdminSecurityContext = createContext<AdminSecurityContextType>({
  isSecureAdmin: false,
  adminSessionValid: false,
  refreshAdminSession: async () => {},
});

export const useAdminSecurity = () => useContext(AdminSecurityContext);

interface AdminSecurityProviderProps {
  children: React.ReactNode;
}

const AdminSecurityProvider = ({ children }: AdminSecurityProviderProps) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const [isSecureAdmin, setIsSecureAdmin] = useState(false);
  const [adminSessionValid, setAdminSessionValid] = useState(false);

  const verifyAdminSecurity = async () => {
    if (!user || !isAdmin) {
      setIsSecureAdmin(false);
      setAdminSessionValid(false);
      return;
    }

    // Rate limit admin verification requests
    if (!checkRateLimit(`admin_verify_${user.id}`, 10, 300000)) { // 5 minutes
      logSecurityEvent('admin_verification_rate_limited', { userId: user.id });
      setIsSecureAdmin(false);
      return;
    }

    try {
      // Use the enhanced admin verification function
      const { data, error } = await supabase.rpc('has_admin_role', {
        user_uuid: user.id
      });

      if (error) {
        logSecurityEvent('admin_verification_failed', { 
          userId: user.id, 
          error: error.message 
        });
        setIsSecureAdmin(false);
        setAdminSessionValid(false);
        return;
      }

      if (data === true) {
        setIsSecureAdmin(true);
        setAdminSessionValid(true);
        logSecurityEvent('admin_verification_success', { userId: user.id });
      } else {
        logSecurityEvent('admin_verification_denied', { userId: user.id });
        setIsSecureAdmin(false);
        setAdminSessionValid(false);
      }
    } catch (error) {
      logSecurityEvent('admin_verification_error', { userId: user.id, error });
      setIsSecureAdmin(false);
      setAdminSessionValid(false);
    }
  };

  const refreshAdminSession = async () => {
    await verifyAdminSecurity();
  };

  useEffect(() => {
    verifyAdminSecurity();
    
    // Re-verify admin status every 5 minutes
    const interval = setInterval(verifyAdminSecurity, 300000);
    return () => clearInterval(interval);
  }, [user, isAdmin]);

  return (
    <AdminSecurityContext.Provider value={{
      isSecureAdmin,
      adminSessionValid,
      refreshAdminSession
    }}>
      {children}
    </AdminSecurityContext.Provider>
  );
};

export default AdminSecurityProvider;
