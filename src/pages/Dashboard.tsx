
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import ImprovedWelcomeSection from '@/components/dashboard/ImprovedWelcomeSection';
import EnhancedQuickStats from '@/components/dashboard/EnhancedQuickStats';
import ImprovedOrdersTable from '@/components/dashboard/ImprovedOrdersTable';
import ReferralBox from '@/components/dashboard/ReferralBox';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { useOrderCleanup } from '@/hooks/useOrderCleanup';

const Dashboard = () => {
  // Enable real-time updates
  useRealtimeNotifications();
  useRealtimeOrders();
  
  // Enable periodic cleanup of abandoned draft orders
  useOrderCleanup();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 space-y-8 p-6">
            <ImprovedWelcomeSection />
            <EnhancedQuickStats />
            <ImprovedOrdersTable />
            <ReferralBox />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
