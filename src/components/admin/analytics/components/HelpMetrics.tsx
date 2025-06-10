
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Star, Phone, TrendingUp } from 'lucide-react';
import type { AnalyticsData } from '../types/analyticsTypes';

interface HelpMetricsProps {
  analytics: AnalyticsData;
}

const HelpMetrics = ({ analytics }: HelpMetricsProps) => {
  const metrics = [
    {
      label: 'Gesamte Anfragen',
      value: analytics.total_questions.toString(),
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Ø Zufriedenheit',
      value: analytics.avg_satisfaction ? `${analytics.avg_satisfaction.toFixed(1)}/5` : 'N/A',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Support-Kontakt',
      value: analytics.support_contact_rate ? `${analytics.support_contact_rate.toFixed(1)}%` : '0%',
      icon: Phone,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Top Fragen',
      value: analytics.top_questions.length.toString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <Card key={metric.label} className="border border-border bg-card hover:bg-accent/5 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-light text-foreground tracking-tight">
                    {metric.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default HelpMetrics;
