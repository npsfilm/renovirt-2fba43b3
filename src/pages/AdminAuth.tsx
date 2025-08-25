
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import AdminAuthLayout from '@/components/auth/AdminAuthLayout';
import AdminLoginForm from '@/components/auth/AdminLoginForm';

const AdminAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const navigate = useNavigate();

  console.log('AdminAuth component state:', { 
    user: !!user, 
    isAdmin, 
    authLoading, 
    adminLoading,
    userEmail: user?.email 
  });

  // Weiterleitung wenn bereits als Administrator angemeldet
  useEffect(() => {
    if (authLoading || adminLoading) {
      console.log('AdminAuth: Still loading...');
      return;
    }

    if (user && isAdmin) {
      console.log('AdminAuth: Redirecting admin to dashboard');
      navigate('/admin/dashboard');
    } else if (user && !isAdmin) {
      console.log('AdminAuth: Redirecting non-admin user to client dashboard');
      // Wenn Benutzer angemeldet aber kein Administrator ist, zum normalen Dashboard weiterleiten
      navigate('/dashboard');
    } else if (!user) {
      console.log('AdminAuth: No user, staying on admin auth page');
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const handleAuthSuccess = () => {
    console.log('AdminAuth: Auth success, checking admin status...');
    // Kurze Verzögerung um Admin-Role-Check zu ermöglichen
    setTimeout(() => {
      window.location.reload(); // Erzwingt Neuladung der Admin-Rollen-Prüfung
    }, 500);
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthLayout>
      <AdminLoginForm onSuccess={handleAuthSuccess} />
    </AdminAuthLayout>
  );
};

export default AdminAuth;
