
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Referrals = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader title="Weiterempfehlungen" subtitle="Empfehlen Sie uns weiter und erhalten Sie Belohnungen" />
          <main className="flex-1 p-6 py-[24px]">
            <Card>
              <CardHeader>
                <CardTitle>Weiterempfehlungen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hier können Sie das Weiterempfehlungsprogramm verwalten.
                </p>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Referrals;
