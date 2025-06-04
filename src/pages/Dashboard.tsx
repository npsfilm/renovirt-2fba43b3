
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import QuickStats from '@/components/dashboard/QuickStats';
import RecentOrdersCompact from '@/components/dashboard/RecentOrdersCompact';
import QuickActions from '@/components/dashboard/QuickActions';
import AIToolsQuickAccess from '@/components/dashboard/AIToolsQuickAccess';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const Dashboard = () => {
  // Enable real-time updates
  useRealtimeNotifications();
  useRealtimeOrders();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Dashboard" 
            subtitle="Übersicht über Ihre Bestellungen und Aktivitäten"
          />

          <main className="flex-1 space-y-6 p-6">
            <WelcomeSection />
            <QuickStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrdersCompact />
              <QuickActions />
            </div>
            
            <AIToolsQuickAccess />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
