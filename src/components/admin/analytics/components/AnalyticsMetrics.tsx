
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, MessageCircle, ThumbsUp, Phone } from 'lucide-react';
import type { AnalyticsData } from '../types/analyticsTypes';

interface AnalyticsMetricsProps {
  analytics: AnalyticsData;
}

const AnalyticsMetrics = ({ analytics }: AnalyticsMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gesamtfragen</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.total_questions}</div>
          <p className="text-xs text-muted-foreground">Letzten 30 Tage</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Zufriedenheit</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.avg_satisfaction ? `${(analytics.avg_satisfaction * 100).toFixed(0)}%` : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Durchschnittliche Bewertung</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Support-Kontakte</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.support_contact_rate ? `${analytics.support_contact_rate.toFixed(1)}%` : '0%'}
          </div>
          <p className="text-xs text-muted-foreground">Weiterleitungsrate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI-Effizienz</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.support_contact_rate ? `${(100 - analytics.support_contact_rate).toFixed(1)}%` : '100%'}
          </div>
          <p className="text-xs text-muted-foreground">Selbst gelöste Fragen</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsMetrics;
