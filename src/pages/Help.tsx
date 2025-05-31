
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  FileText, 
  Search,
  Phone,
  Clock
} from 'lucide-react';

const Help = () => {
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
                  <div className="text-center p-4 border rounded-lg">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold mb-2">Erste Schritte</h3>
                    <p className="text-sm text-gray-600">Lernen Sie, wie Sie Bilder hochladen und bearbeiten</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold mb-2">FAQ</h3>
                    <p className="text-sm text-gray-600">Antworten auf häufig gestellte Fragen</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold mb-2">Video-Tutorials</h3>
                    <p className="text-sm text-gray-600">Schritt-für-Schritt Anleitungen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Support kontaktieren
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="subject">Betreff</Label>
                    <Input id="subject" placeholder="Beschreiben Sie Ihr Anliegen kurz" />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priorität</Label>
                    <select className="w-full p-2 border rounded-md" id="priority">
                      <option value="low">Niedrig</option>
                      <option value="medium">Mittel</option>
                      <option value="high">Hoch</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Nachricht</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Beschreiben Sie Ihr Problem oder Ihre Frage ausführlich..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Nachricht senden
                </Button>
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
                    <span className="text-sm">support@renovirt.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">+49 (0) 123 456 789</span>
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
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Help;
