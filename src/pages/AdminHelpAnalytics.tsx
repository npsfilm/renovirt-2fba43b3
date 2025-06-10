
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import HelpAnalytics from '@/components/admin/analytics/HelpAnalytics';

const AdminHelpAnalytics = () => {
  return (
    <AdminLayout>
      {/* Kopfzeile */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Hilfestatistik</h1>
            <p className="text-sm text-muted-foreground">
              Übersicht über alle Hilfe-Anfragen und deren Bewertungen
            </p>
          </div>
        </div>
      </header>

      {/* Hauptinhalt */}
      <main className="flex-1 p-6 bg-background">
        <HelpAnalytics />
      </main>
    </AdminLayout>
  );
};

export default AdminHelpAnalytics;
