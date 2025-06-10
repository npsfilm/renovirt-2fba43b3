
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import { logSecurityEvent } from '@/utils/secureLogging';

interface SecureAdminWrapperProps {
  children: React.ReactNode;
  requireReauth?: boolean;
}

const SecureAdminWrapper = ({ children, requireReauth = false }: SecureAdminWrapperProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();

  console.log('SecureAdminWrapper check:', { 
    user: !!user, 
    isAdmin, 
    authLoading, 
    adminLoading,
    userId: user?.id 
  });

  // Zeige Ladebildschirm während der Authentifizierung
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Überprüfe Admin-Berechtigung...</p>
        </div>
      </div>
    );
  }

  // Protokolliere unbefugte Zugriffe
  if (user && !isAdmin) {
    logSecurityEvent('unauthorized_admin_access_attempt', { userId: user.id });
    console.log('Access denied: User is not admin', { userId: user.id, isAdmin });
  }

  // Weiterleitung zur Admin-Anmeldung wenn nicht authentifiziert
  if (!user) {
    console.log('Redirecting to admin-auth: No user');
    return <Navigate to="/admin-auth" replace />;
  }

  // Weiterleitung zur Admin-Anmeldung wenn kein Administrator
  if (!isAdmin) {
    console.log('Redirecting to admin-auth: User is not admin');
    return <Navigate to="/admin-auth" replace />;
  }

  console.log('Admin access granted');
  return <>{children}</>;
};

export default SecureAdminWrapper;
