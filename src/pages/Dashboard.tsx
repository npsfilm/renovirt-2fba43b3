
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/layout/MobileLayout';
import GlobalAIWidget from '@/components/layout/GlobalAIWidget';

// Mobile-first components
import MobileStatusBar from '@/components/dashboard/mobile/MobileStatusBar';
import QuickStatsCards from '@/components/dashboard/mobile/QuickStatsCards';
import ModernHeroWidget from '@/components/dashboard/mobile/ModernHeroWidget';
import ActiveProjectsCarousel from '@/components/dashboard/mobile/ActiveProjectsCarousel';

// Desktop fallback components
import ModernHeroSection from '@/components/dashboard/ModernHeroSection';
import ActiveProjectsGrid from '@/components/dashboard/ActiveProjectsGrid';

const Dashboard = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileLayout>
        {/* Mobile Status Bar */}
        <MobileStatusBar />
        
        {/* Content - Edge-to-edge mobile design */}
        <div className="space-y-6">
          {/* Hero Widget */}
          <div className="pt-2">
            <ModernHeroWidget />
          </div>
          
          {/* Quick Stats Cards */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground px-2">
              Übersicht
            </h2>
            <QuickStatsCards />
          </div>
          
          {/* Active Projects Carousel */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground px-2">
              Aktive Projekte
            </h2>
            <ActiveProjectsCarousel />
          </div>
        </div>
        
        <GlobalAIWidget />
      </MobileLayout>
    );
  }

  // Desktop layout
  return (
    <MobileLayout className="p-6 space-y-8">
      <ModernHeroSection />
      <ActiveProjectsGrid />
      <GlobalAIWidget />
    </MobileLayout>
  );
};

export default Dashboard;
