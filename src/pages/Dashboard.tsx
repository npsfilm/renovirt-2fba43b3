
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import QuickStats from '@/components/dashboard/QuickStats';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentOrdersCompact from '@/components/dashboard/RecentOrdersCompact';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Schnellstart: Ihre Bilder in wenigen Klicks optimieren
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Benachrichtigungen
              </Button>
            </div>
          </header>

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
              <div>
                <QuickActions />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
