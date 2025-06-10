
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import AdminSessionGuard from '@/components/security/AdminSessionGuard';
import { trackSecurityEvent } from '@/utils/securityMonitoring';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();

  React.useEffect(() => {
    // Track admin page access
    trackSecurityEvent('admin_page_access', { 
      userId: user?.id,
      timestamp: new Date().toISOString()
    }, 'low');
  }, [user?.id]);

  return (
    <AdminSessionGuard timeoutMinutes={30}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </AdminSessionGuard>
  );
};

export default AdminLayout;
