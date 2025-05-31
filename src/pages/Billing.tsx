
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Receipt } from 'lucide-react';

const Billing = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Abrechnung" 
            subtitle="Verwalten Sie Ihre Zahlungen und Rechnungen"
          />

          <main className="flex-1 space-y-6 p-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Aktueller Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Starter Plan</h3>
                    <p className="text-sm text-gray-600">3 kostenlose Bilder</p>
                  </div>
                  <Button variant="outline">Plan ändern</Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Zahlungshistorie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Noch keine Zahlungen vorhanden</p>
                  <p className="text-sm">Ihre Rechnungen werden hier angezeigt</p>
                </div>
              </CardContent>
            </Card>

            {/* Download Invoice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Rechnungen herunterladen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Laden Sie Ihre Rechnungen als PDF herunter
                </p>
                <Button variant="outline" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Alle Rechnungen herunterladen
                </Button>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Billing;
