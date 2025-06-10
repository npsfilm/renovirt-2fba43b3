
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSecurityMetrics } from '@/utils/securityMonitoring';
import SecurityAuditLog from '@/components/security/SecurityAuditLog';
import { Shield, AlertTriangle, Eye, User, Activity } from 'lucide-react';

const SecurityDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['security-metrics'],
    queryFn: () => getSecurityMetrics('day'),
    refetchInterval: 30000, // Alle 30 Sekunden aktualisieren
  });

  const getStatusColor = (value: number, warning: number, critical: number) => {
    if (value >= critical) return 'bg-red-100 text-red-800';
    if (value >= warning) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (value: number, warning: number, critical: number) => {
    if (value >= critical) return 'Kritisch';
    if (value >= warning) return 'Warnung';
    return 'Normal';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>
          <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Sicherheitsmetriken */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Fehlgeschlagene Anmeldungen</p>
                  <p className="text-2xl font-bold">{metrics?.failedLogins || 0}</p>
                </div>
                <User className="w-8 h-8 text-red-500" />
              </div>
              <Badge className={getStatusColor(metrics?.failedLogins || 0, 5, 10)}>
                {getStatusText(metrics?.failedLogins || 0, 5, 10)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verdächtige Aktivitäten</p>
                  <p className="text-2xl font-bold">{metrics?.suspiciousActivity || 0}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <Badge className={getStatusColor(metrics?.suspiciousActivity || 0, 3, 5)}>
                {getStatusText(metrics?.suspiciousActivity || 0, 3, 5)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Admin-Aktionen</p>
                  <p className="text-2xl font-bold">{metrics?.adminActions || 0}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Überwacht
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Datenzugriffe</p>
                  <p className="text-2xl font-bold">{metrics?.dataAccess || 0}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
              <Badge className="bg-green-100 text-green-800">
                Normal
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Sicherheitsstatus-Übersicht */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Sicherheitsstatus (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">RLS-Richtlinien</p>
                    <p className="text-sm text-gray-600">Alle Datenbanktabellen sind geschützt</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Audit-Logging</p>
                    <p className="text-sm text-gray-600">Sicherheitsereignisse werden protokolliert</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Aktiv</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Admin-Session-Überwachung</p>
                    <p className="text-sm text-gray-600">30-Minuten Timeout für Admin-Sessions</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Überwacht</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <div>
        <SecurityAuditLog />
      </div>
    </div>
  );
};

export default SecurityDashboard;
