
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import ModernHeroSection from '@/components/dashboard/ModernHeroSection';
import ActiveProjectsGrid from '@/components/dashboard/ActiveProjectsGrid';
import GlobalAIWidget from '@/components/layout/GlobalAIWidget';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 p-6 space-y-8 bg-transparent">
            {/* Hero Section */}
            <ModernHeroSection />
            
            {/* Active Projects - Now full width */}
            <ActiveProjectsGrid />
          </main>
        </SidebarInset>
        <GlobalAIWidget />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
