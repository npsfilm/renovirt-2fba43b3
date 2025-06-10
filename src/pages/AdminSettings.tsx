
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import SecurityDashboard from '@/components/admin/SecurityDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Settings } from 'lucide-react';

const AdminSettings = () => {
  return (
    <AdminLayout>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin-Einstellungen</h1>
            <p className="text-sm text-gray-600">
              Sicherheitsüberwachung und Systemkonfiguration
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Sicherheits-Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Sicherheitsüberwachung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SecurityDashboard />
          </CardContent>
        </Card>

        {/* System-Einstellungen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System-Konfiguration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Sicherheitsrichtlinien</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Admin Session Timeout:</span>
                    <span className="font-mono">30 Minuten</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limiting:</span>
                    <span className="text-green-600">Aktiv</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RLS Policies:</span>
                    <span className="text-green-600">Aktiv</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Logging:</span>
                    <span className="text-green-600">Aktiv</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Upload-Beschränkungen</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Max. Dateigröße:</span>
                    <span className="font-mono">100 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Erlaubte Dateitypen:</span>
                    <span className="font-mono">Bilder</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Malware-Scan:</span>
                    <span className="text-green-600">Aktiv</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sicherheits-Validierung:</span>
                    <span className="text-green-600">Erweitert</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
};

export default AdminSettings;
