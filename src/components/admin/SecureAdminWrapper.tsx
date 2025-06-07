
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSecurity } from '@/components/security/EnhancedSecurityProvider';
import { useAuth } from '@/hooks/useAuth';
import { logSecurityEvent } from '@/utils/secureLogging';

interface SecureAdminWrapperProps {
  children: React.ReactNode;
  requireReauth?: boolean;
}

const SecureAdminWrapper = ({ children, requireReauth = false }: SecureAdminWrapperProps) => {
  const { user } = useAuth();
  const { hasAdminAccess, isSecureSession, refreshSecurity } = useSecurity();
  const [loading, setLoading] = useState(true);
  const [lastAuthCheck, setLastAuthCheck] = useState(Date.now());

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Re-authenticate if required or if last check was > 30 minutes ago
      const needsReauth = requireReauth || (Date.now() - lastAuthCheck > 1800000);
      
      if (needsReauth) {
        await refreshSecurity();
        setLastAuthCheck(Date.now());
      }

      setLoading(false);
    };

    checkAuth();
  }, [user, requireReauth, refreshSecurity, lastAuthCheck]);

  useEffect(() => {
    if (user && !hasAdminAccess) {
      logSecurityEvent('unauthorized_admin_access_attempt', { userId: user.id });
    }
  }, [user, hasAdminAccess]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Überprüfe Admin-Berechtigung...</p>
        </div>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!user || !isSecureSession) {
    return <Navigate to="/admin-auth" replace />;
  }

  // Redirect to admin login if not admin
  if (!hasAdminAccess) {
    return <Navigate to="/admin-auth" replace />;
  }

  return <>{children}</>;
};

export default SecureAdminWrapper;
