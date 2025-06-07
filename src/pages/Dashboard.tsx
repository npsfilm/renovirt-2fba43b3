
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import ModernHeroSection from '@/components/dashboard/ModernHeroSection';
import IntelligentStats from '@/components/dashboard/IntelligentStats';
import ActiveProjectsGrid from '@/components/dashboard/ActiveProjectsGrid';
import ModernReferralBox from '@/components/dashboard/ModernReferralBox';
import GlobalAIWidget from '@/components/layout/GlobalAIWidget';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-card/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-light text-foreground">Dashboard</h1>
          </header>
          <main className="flex-1 p-6 space-y-8 bg-transparent">
            {/* Hero Section */}
            <ModernHeroSection />
            
            {/* Intelligent Stats */}
            <IntelligentStats />
            
            {/* Active Projects - Now full width */}
            <ActiveProjectsGrid />

            {/* Modern Referral Box */}
            <ModernReferralBox />
          </main>
        </SidebarInset>
        <GlobalAIWidget />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
