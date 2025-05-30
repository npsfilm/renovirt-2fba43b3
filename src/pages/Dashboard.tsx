
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import QuickStats from '@/components/dashboard/QuickStats';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentOrdersCompact from '@/components/dashboard/RecentOrdersCompact';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Dashboard" 
            subtitle="Schnellstart: Ihre Bilder in wenigen Klicks optimieren"
          />

          {/* Main Content */}
          <main className="flex-1 space-y-6 p-6">
            {/* Welcome Section */}
            <WelcomeSection />

            {/* Quick Stats */}
            <QuickStats />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentOrdersCompact />
              </div>
              <div className="space-y-6">
                <QuickActions />
                <NotificationCenter />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
