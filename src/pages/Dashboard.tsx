
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentOrdersCompact from '@/components/dashboard/RecentOrdersCompact';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickStats from '@/components/dashboard/QuickStats';
import AIToolsQuickAccess from '@/components/dashboard/AIToolsQuickAccess';
import ProfileBilling from '@/components/dashboard/ProfileBilling';
import { useRealTimeOrderUpdates } from '@/hooks/useRealTimeOrderUpdates';

const Dashboard = () => {
  // Enable real-time updates for order status changes
  useRealTimeOrderUpdates();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Willkommen zurück! Hier ist Ihr Überblick.
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Welcome and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <WelcomeSection />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Stats Overview */}
            <QuickStats />

            {/* Recent Orders and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentOrdersCompact />
              <RecentActivity />
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AIToolsQuickAccess />
              <ProfileBilling />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
