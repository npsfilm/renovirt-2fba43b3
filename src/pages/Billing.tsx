
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import BillingOverview from '@/components/profile/BillingOverview';

const Billing = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Abrechnung & Zahlungen" 
            subtitle="Verwalten Sie Ihre Zahlungen, Rechnungen und Abrechnungsdetails"
          />
          <main className="flex-1 p-6">
            <BillingOverview />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Billing;
