
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminRole } from '@/hooks/useAdminRole';
import AdminAuthLayout from '@/components/auth/AdminAuthLayout';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import AdminRegisterForm from '@/components/auth/AdminRegisterForm';

const AdminAuth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
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
      {/* Custom Tab Navigation */}
      <div className="w-full mb-8">
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
          <button
            onClick={() => setActiveTab('login')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'login'
                ? 'bg-background text-foreground shadow-sm'
                : ''
            }`}
          >
            Admin Anmelden
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full ${
              activeTab === 'register'
                ? 'bg-background text-foreground shadow-sm'
                : ''
            }`}
          >
            Admin Registrieren
          </button>
        </div>
      </div>

      {/* Forms */}
      {activeTab === 'login' && (
        <AdminLoginForm onSuccess={handleAuthSuccess} />
      )}

      {activeTab === 'register' && (
        <AdminRegisterForm onSuccess={handleAuthSuccess} />
      )}
    </AdminAuthLayout>
  );
};

export default AdminAuth;
