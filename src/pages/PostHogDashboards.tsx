import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDashboardCreator } from '@/utils/posthogDashboards';
import { CheckCircle, AlertCircle, BarChart3, TrendingUp, Users, Zap } from 'lucide-react';
import { toast } from 'sonner';

const PostHogDashboards = () => {
  const [creationStatus, setCreationStatus] = useState<Record<string, 'idle' | 'creating' | 'success' | 'error'>>({});
  const { createDashboard, setupAllDashboards, predefinedDashboards } = useDashboardCreator();

  const handleCreateDashboard = async (dashboardKey: string, config: any) => {
    setCreationStatus(prev => ({ ...prev, [dashboardKey]: 'creating' }));
    
    try {
      const result = await createDashboard(config);
      if (result.success) {
        setCreationStatus(prev => ({ ...prev, [dashboardKey]: 'success' }));
        toast.success(`Dashboard "${config.name}" wurde konfiguriert`);
      } else {
        setCreationStatus(prev => ({ ...prev, [dashboardKey]: 'error' }));
        toast.error(result.message);
      }
    } catch (error) {
      setCreationStatus(prev => ({ ...prev, [dashboardKey]: 'error' }));
      toast.error('Fehler beim Erstellen des Dashboards');
    }
  };

  const handleSetupAll = async () => {
    setCreationStatus({
      orderFunnel: 'creating',
      helpSystem: 'creating',
      admin: 'creating',
      businessMetrics: 'creating'
    });

    const results = await setupAllDashboards();
    const newStatus: Record<string, 'success' | 'error'> = {};

    results.forEach((result, index) => {
      const keys = ['orderFunnel', 'helpSystem', 'admin', 'businessMetrics'];
      newStatus[keys[index]] = result.success ? 'success' : 'error';
    });

    setCreationStatus(newStatus);
    
    const successCount = results.filter(r => r.success).length;
    if (successCount === results.length) {
      toast.success('Alle Dashboards wurden erfolgreich konfiguriert');
    } else {
      toast.warning(`${successCount} von ${results.length} Dashboards wurden konfiguriert`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'creating':
        return <Badge variant="secondary">Wird erstellt...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Konfiguriert</Badge>;
      case 'error':
        return <Badge variant="destructive">Fehler</Badge>;
      default:
        return <Badge variant="outline">Bereit</Badge>;
    }
  };

  const dashboards = [
    {
      key: 'orderFunnel',
      config: predefinedDashboards.orderFunnel,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      key: 'helpSystem',
      config: predefinedDashboards.helpSystem,
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      key: 'admin',
      config: predefinedDashboards.admin,
      icon: <Users className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      key: 'businessMetrics',
      config: predefinedDashboards.businessMetrics,
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">PostHog Dashboards</h1>
        <p className="text-muted-foreground">
          Konfigurieren Sie vordefinierte Dashboards für umfassende Analytics
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Verfügbare Dashboards</h2>
          <p className="text-sm text-muted-foreground">
            Erstellen Sie spezialisierte Dashboards für verschiedene Geschäftsbereiche
          </p>
        </div>
        <Button 
          onClick={handleSetupAll}
          disabled={Object.values(creationStatus).some(status => status === 'creating')}
        >
          Alle Dashboards erstellen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboards.map(({ key, config, icon, color }) => (
          <Card key={key} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(creationStatus[key])}
                      {getStatusBadge(creationStatus[key])}
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm">
                {config.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Enthaltene Insights:</h4>
                <div className="space-y-1">
                  {config.insights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{insight.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <Button
                onClick={() => handleCreateDashboard(key, config)}
                disabled={creationStatus[key] === 'creating' || creationStatus[key] === 'success'}
                variant={creationStatus[key] === 'success' ? 'secondary' : 'default'}
                className="w-full"
              >
                {creationStatus[key] === 'creating' ? 'Wird erstellt...' :
                 creationStatus[key] === 'success' ? 'Konfiguriert' :
                 'Dashboard erstellen'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PostHog Dashboard Setup</CardTitle>
          <CardDescription>
            Diese Dashboards werden als Konfigurationen erstellt. Sie müssen sie manuell in PostHog importieren.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>Nächste Schritte:</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Dashboards hier konfigurieren</li>
              <li>PostHog Dashboard-Bereich öffnen</li>
              <li>Neue Dashboards mit den generierten Konfigurationen erstellen</li>
              <li>Insights basierend auf den Event-Namen hinzufügen</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostHogDashboards;