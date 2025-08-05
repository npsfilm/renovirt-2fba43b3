
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import ModernHeroSection from '@/components/dashboard/ModernHeroSection';
import ActiveProjectsGrid from '@/components/dashboard/ActiveProjectsGrid';
import GlobalAIWidget from '@/components/layout/GlobalAIWidget';

const Dashboard = () => {
  return (
    <MobileLayout className="p-6 space-y-8">
      {/* Hero Section */}
      <ModernHeroSection />
      
      {/* Active Projects - Now full width */}
      <ActiveProjectsGrid />
      
      <GlobalAIWidget />
    </MobileLayout>
  );
};

export default Dashboard;
