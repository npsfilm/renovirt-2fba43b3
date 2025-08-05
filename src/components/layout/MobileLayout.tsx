import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className = '' }: MobileLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile layout - no sidebar, bottom navigation
    return (
      <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-background via-background to-muted/20">
        <main className={`flex-1 pb-20 ${className}`}>
          {children}
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  // Desktop layout - sidebar
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/20">
        <AppSidebar />
        <SidebarInset>
          <main className={`flex-1 ${className}`}>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MobileLayout;