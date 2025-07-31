import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Star, Phone, AlertCircle } from 'lucide-react';

interface SimpleMetricsProps {
  totalToday: number;
  totalWeek: number;
  avgSatisfaction: number | null;
  supportRate: number | null;
  negativeCount: number;
}

const SimpleMetrics = ({ totalToday, totalWeek, avgSatisfaction, supportRate, negativeCount }: SimpleMetricsProps) => {
  const getSatisfactionColor = (rating: number | null) => {
    if (!rating) return 'text-muted-foreground';
    if (rating >= 4.0) return 'text-green-600';
    if (rating >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSatisfactionBg = (rating: number | null) => {
    if (!rating) return 'bg-muted';
    if (rating >= 4.0) return 'bg-green-100 border-green-200';
    if (rating >= 3.0) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Anfragen heute/Woche */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Anfragen</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalToday}</div>
          <p className="text-xs text-muted-foreground">
            {totalWeek} diese Woche
          </p>
        </CardContent>
      </Card>

      {/* Durchschnittliche Zufriedenheit */}
      <Card className={getSatisfactionBg(avgSatisfaction)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Zufriedenheit</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getSatisfactionColor(avgSatisfaction)}`}>
            {avgSatisfaction ? `${avgSatisfaction.toFixed(1)}/5` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            Durchschnittsbewertung
          </p>
        </CardContent>
      </Card>

      {/* Support-Eskalationsrate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Support-Rate</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {supportRate ? `${supportRate.toFixed(1)}%` : '0%'}
          </div>
          <p className="text-xs text-muted-foreground">
            Kontaktieren Support
          </p>
        </CardContent>
      </Card>

      {/* Negative Fälle */}
      <Card className={negativeCount > 0 ? 'bg-red-50 border-red-200' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Probleme</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${negativeCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {negativeCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Negative Bewertungen
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleMetrics;