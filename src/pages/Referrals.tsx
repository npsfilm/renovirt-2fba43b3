
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModernReferralBox from '@/components/dashboard/ModernReferralBox';
import ReferralStats from '@/components/referrals/ReferralStats';
import ReferralHistory from '@/components/referrals/ReferralHistory';
import ReferralInstructions from '@/components/referrals/ReferralInstructions';

const Referrals = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader title="Weiterempfehlungen" subtitle="Empfehlen Sie uns weiter und erhalten Sie Belohnungen" />
          <main className="flex-1 p-6 py-[24px] space-y-6">
            <div className="grid gap-6">
              {/* Main Referral Box */}
              <ModernReferralBox />
              
              {/* Stats Overview */}
              <ReferralStats />
              
              {/* How it works */}
              <ReferralInstructions />
              
              {/* Referral History */}
              <ReferralHistory />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Referrals;
