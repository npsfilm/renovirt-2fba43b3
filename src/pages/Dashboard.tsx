
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import ImprovedWelcomeSection from '@/components/dashboard/ImprovedWelcomeSection';
import EnhancedQuickStats from '@/components/dashboard/EnhancedQuickStats';
import ImprovedOrdersTable from '@/components/dashboard/ImprovedOrdersTable';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ModernReferralBox from '@/components/dashboard/ModernReferralBox';
import GlobalAIWidget from '@/components/layout/GlobalAIWidget';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </header>
          <main className="flex-1 p-6 space-y-6">
            <ImprovedWelcomeSection />
            <EnhancedQuickStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ImprovedOrdersTable />
              </div>
              
              <div className="space-y-6">
                <RecentActivity />
              </div>
            </div>

            <ModernReferralBox />
          </main>
        </SidebarInset>
        <GlobalAIWidget />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
