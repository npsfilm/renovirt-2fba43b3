
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

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/management');
    } else if (user && !isAdmin) {
      // If user is authenticated but not admin, redirect to regular dashboard
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const handleAuthSuccess = () => {
    // After successful auth, the useEffect above will handle redirection
  };

  return (
    <AdminAuthLayout>
      <AdminLoginForm onSuccess={handleAuthSuccess} />
    </AdminAuthLayout>
  );
};

export default AdminAuth;
