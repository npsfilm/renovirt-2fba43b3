import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import PageHeader from '@/components/layout/PageHeader';
import BillingOverview from '@/components/profile/BillingOverview';
import { useIsMobile } from '@/hooks/use-mobile';

const Billing = () => {
  const isMobile = useIsMobile();
  
  return (
    <MobileLayout>
      {!isMobile && (
        <PageHeader title="Abrechnung & Zahlungen" subtitle="Verwalten Sie Ihre Zahlungen, Rechnungen und Abrechnungsdetails" />
      )}
      <div className="p-6 py-[24px]">
        {isMobile && (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Rechnungen</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihre Zahlungen und Rechnungen</p>
          </div>
        )}
        <BillingOverview />
      </div>
    </MobileLayout>
  );
};
export default Billing;