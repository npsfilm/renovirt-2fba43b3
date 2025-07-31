
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Star, Phone, TrendingUp } from 'lucide-react';
import type { AnalyticsData } from '../types/analyticsTypes';

interface HelpMetricsProps {
  analytics: AnalyticsData;
}

const HelpMetrics = ({ analytics }: HelpMetricsProps) => {
  const positiveRatings = analytics.total_questions > 0 ? 
    Math.round((analytics.avg_satisfaction || 0) * 100 / 5) : 0;
  
  const metrics = [
    {
      label: 'Gesamte Anfragen',
      value: analytics.total_questions.toString(),
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: analytics.total_questions > 0 ? '+' : '',
    },
    {
      label: 'Ø Zufriedenheit',
      value: analytics.avg_satisfaction ? 
        `${analytics.avg_satisfaction.toFixed(1)} ⭐` : 
        'Keine Bewertungen',
      icon: Star,
      color: analytics.avg_satisfaction && analytics.avg_satisfaction >= 4 ? 'text-green-600' : 
             analytics.avg_satisfaction && analytics.avg_satisfaction >= 3 ? 'text-yellow-600' : 'text-red-600',
      bgColor: analytics.avg_satisfaction && analytics.avg_satisfaction >= 4 ? 'bg-green-50' : 
               analytics.avg_satisfaction && analytics.avg_satisfaction >= 3 ? 'bg-yellow-50' : 'bg-red-50',
      subtitle: analytics.avg_satisfaction ? `${positiveRatings}% zufrieden` : '',
    },
    {
      label: 'Support-Kontakt',
      value: analytics.support_contact_rate ? `${analytics.support_contact_rate.toFixed(1)}%` : '0%',
      icon: Phone,
      color: analytics.support_contact_rate && analytics.support_contact_rate > 10 ? 'text-red-600' : 
             analytics.support_contact_rate && analytics.support_contact_rate > 5 ? 'text-yellow-600' : 'text-green-600',
      bgColor: analytics.support_contact_rate && analytics.support_contact_rate > 10 ? 'bg-red-50' : 
               analytics.support_contact_rate && analytics.support_contact_rate > 5 ? 'bg-yellow-50' : 'bg-green-50',
      subtitle: 'Eskalationsrate',
    },
    {
      label: 'Top Fragen',
      value: analytics.top_questions.length.toString(),
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      subtitle: 'Häufige Themen',
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
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-light text-foreground tracking-tight">
                    {metric.value}
                  </p>
                  {(metric as any).subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {(metric as any).subtitle}
                    </p>
                  )}
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
