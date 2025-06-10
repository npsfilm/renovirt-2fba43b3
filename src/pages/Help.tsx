
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import IntelligentHelpSearch from '@/components/help/IntelligentHelpSearch';
import AIChatWidget from '@/components/help/AIChatWidget';
import { 
  Mail, 
  Clock,
  HelpCircle
} from 'lucide-react';

const Help = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Hilfe" 
            subtitle="Wie können wir Ihnen helfen?"
          />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto bg-muted/30 rounded-xl p-8 space-y-8">
              {/* Main Help Search - Hero Section */}
              <IntelligentHelpSearch />

              {/* Updated Contact Information */}
              <div className="border-t border-border pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <Mail className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Kontakt</p>
                    <p className="text-sm text-muted-foreground">
                      Bitte nutzen Sie die Hilfe oben, danach können Sie uns eine Support Nachricht zukommen lassen.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Clock className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Support-Zeiten</p>
                    <p className="text-sm text-muted-foreground">Mo-Fr: 9:00-18:00</p>
                  </div>
                  
                  <div className="space-y-2">
                    <HelpCircle className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Antwortzeit</p>
                    <p className="text-sm text-muted-foreground">Innerhalb von 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* AI Chat Widget */}
          <AIChatWidget />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Help;
