
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import AdminAuthLayout from '@/components/auth/AdminAuthLayout';
import AdminLoginForm from '@/components/auth/AdminLoginForm';

const AdminAuth = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdminRole();
  const navigate = useNavigate();

  // Weiterleitung wenn bereits als Administrator angemeldet
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    } else if (user && !isAdmin) {
      // Wenn Benutzer angemeldet aber kein Administrator ist, zum normalen Dashboard weiterleiten
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleAuthSuccess = () => {
    // Nach erfolgreicher Anmeldung wird die Weiterleitung durch den useEffect oben gehandhabt
  };

  return (
    <AdminAuthLayout>
      <AdminLoginForm onSuccess={handleAuthSuccess} />
    </AdminAuthLayout>
  );
};

export default AdminAuth;
