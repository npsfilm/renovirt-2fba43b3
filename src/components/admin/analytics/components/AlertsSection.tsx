import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Phone, TrendingUp, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AlertsSectionProps {
  negativeCount: number;
  supportContactsToday: number;
  avgSatisfaction: number | null;
  totalToday: number;
}

const AlertsSection = ({ negativeCount, supportContactsToday, avgSatisfaction, totalToday }: AlertsSectionProps) => {
  const alerts = [];

  // Negative Bewertungen Alert
  if (negativeCount > 0) {
    alerts.push({
      type: 'destructive' as const,
      icon: AlertTriangle,
      title: `${negativeCount} negative Bewertungen`,
      description: 'Benötigen sofortige Aufmerksamkeit',
      count: negativeCount
    });
  }

  // Support-Kontakte Alert
  if (supportContactsToday > 0) {
    alerts.push({
      type: 'warning' as const,
      icon: Phone,
      title: `${supportContactsToday} Support-Kontakte heute`,
      description: 'Kunden haben zusätzliche Hilfe angefordert',
      count: supportContactsToday
    });
  }

  // Positive Trend Alert
  if (avgSatisfaction && avgSatisfaction >= 4.0) {
    alerts.push({
      type: 'success' as const,
      icon: TrendingUp,
      title: 'Hohe Zufriedenheit',
      description: `Durchschnitt: ${avgSatisfaction.toFixed(1)}/5.0`,
      count: null
    });
  }

  // Alles ruhig Alert
  if (alerts.length === 0 && totalToday > 0) {
    alerts.push({
      type: 'success' as const,
      icon: CheckCircle,
      title: 'Alles im grünen Bereich',
      description: `${totalToday} Anfragen, keine kritischen Fälle`,
      count: null
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {alerts.map((alert, index) => (
        <Alert key={index} variant={alert.type} className="relative">
          <alert.icon className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{alert.title}</div>
                <div className="text-sm opacity-90">{alert.description}</div>
              </div>
              {alert.count && (
                <Badge variant={alert.type === 'destructive' ? 'destructive' : 'secondary'} className="ml-2">
                  {alert.count}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default AlertsSection;