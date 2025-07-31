import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import IntelligentHelpSearch from '@/components/help/IntelligentHelpSearch';
import HelpFAQSection from '@/components/help/HelpFAQSection';
import AIChatWidget from '@/components/help/AIChatWidget';
import { Mail, Clock, HelpCircle } from 'lucide-react';
const Help = () => {
  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader title="Hilfe" subtitle="Wie können wir Ihnen helfen?" />

          <main className="flex-1">
            {/* Hero Section with Search - Similar to 1Password */}
            <div className="bg-primary text-primary-foreground py-16 px-6">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold">Brauchen Sie Unterstützung?</h1>
                  <p className="text-xl opacity-90">Wir sind hier, um Ihnen zu helfen! Nutzen Sie unsere Intelligente Suche, um Ihre Fragen zu klären.</p>
                </div>
                
                {/* Search Section */}
                <div className="max-w-2xl mx-auto">
                  <IntelligentHelpSearch />
                </div>
              </div>
            </div>

            {/* FAQ Categories Section - Similar to Netflix */}
            <div className="py-12 px-6 bg-background">
              <div className="max-w-6xl mx-auto">
                <HelpFAQSection />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-muted/30 py-8 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <Mail className="w-6 h-6 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">Kontakt</p>
                    <p className="text-sm text-muted-foreground">Bitte nutzen Sie die Hilfe oben, danach können Sie uns eine Support Nachricht z</p>
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

            {/* Footer */}
            <footer className="border-t bg-gray-50 py-6 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-sm text-gray-600">
                    © 2025 Renovirt - Eine Marke der NPS Media GmbH
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <a href="/privacy" className="text-[#91A56E] hover:underline transition-colors">
                      Datenschutz
                    </a>
                    <a href="/impressum" className="text-[#91A56E] hover:underline transition-colors">
                      Impressum
                    </a>
                    <a href="/agb" className="text-[#91A56E] hover:underline transition-colors">
                      AGB
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </main>

          {/* AI Chat Widget */}
          <AIChatWidget />
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default Help;