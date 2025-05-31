
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react';

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <PageHeader 
            title="Einstellungen" 
            subtitle="Personalisieren Sie Ihre App-Erfahrung"
          />

          <main className="flex-1 space-y-6 p-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Benachrichtigungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                    <span>E-Mail-Benachrichtigungen</span>
                    <span className="text-sm text-gray-600">Erhalten Sie Updates per E-Mail</span>
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="order-updates" className="flex flex-col gap-1">
                    <span>Bestellungs-Updates</span>
                    <span className="text-sm text-gray-600">Benachrichtigungen zu Bestellstatus</span>
                  </Label>
                  <Switch id="order-updates" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Datenschutz & Sicherheit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-processing" className="flex flex-col gap-1">
                    <span>Datenverarbeitung</span>
                    <span className="text-sm text-gray-600">KI-gestützte Bildverarbeitung erlauben</span>
                  </Label>
                  <Switch id="data-processing" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics" className="flex flex-col gap-1">
                    <span>Analytics</span>
                    <span className="text-sm text-gray-600">Helfen Sie uns, den Service zu verbessern</span>
                  </Label>
                  <Switch id="analytics" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Darstellung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                    <span>Dunkler Modus</span>
                    <span className="text-sm text-gray-600">Dunkles Theme aktivieren</span>
                  </Label>
                  <Switch id="dark-mode" />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button>
                <SettingsIcon className="w-4 h-4 mr-2" />
                Einstellungen speichern
              </Button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
