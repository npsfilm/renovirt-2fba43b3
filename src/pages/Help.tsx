
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AIChatWidget from '@/components/help/AIChatWidget';
import IntelligentHelpSearch from '@/components/help/IntelligentHelpSearch';
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  FileText, 
  Search,
  Phone,
  Clock,
  Bot,
  Sparkles
} from 'lucide-react';

const Help = () => {
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier würde die Form-Submission implementiert werden
    console.log('Kontaktformular abgesendet');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Hilfe & Support" 
            subtitle="Wir sind hier, um Ihnen zu helfen"
          />

          <main className="flex-1 space-y-6 p-6">
            {/* Intelligent Help Search - Main Feature */}
            <IntelligentHelpSearch />

            {/* Quick Help */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Schnelle Hilfe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold mb-2">Erste Schritte</h3>
                    <p className="text-sm text-gray-600">Lernen Sie, wie Sie Bilder hochladen und bearbeiten</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold mb-2">FAQ</h3>
                    <p className="text-sm text-gray-600">Antworten auf häufig gestellte Fragen</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold mb-2">Video-Tutorials</h3>
                    <p className="text-sm text-gray-600">Schritt-für-Schritt Anleitungen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Direkter Kontakt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">support@renovirt.de</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">+49 (0) 123 456 789</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      Hinweis: Für schnelle Hilfe nutzen Sie bitte zuerst unsere intelligente Suche oben.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Support-Zeiten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">Montag - Freitag: 9:00 - 18:00</p>
                  <p className="text-sm">Samstag: 10:00 - 16:00</p>
                  <p className="text-sm">Sonntag: Geschlossen</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Antwortzeit: Normalerweise innerhalb von 2-4 Stunden
                  </p>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Intelligente Suche: 24/7 verfügbar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
