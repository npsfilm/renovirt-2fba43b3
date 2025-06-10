
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, ShoppingCart, BarChart } from 'lucide-react';

interface AnalyticsMetricsProps {
  analytics: {
    totalRevenue: number;
    totalOrders: number;
    newCustomers: number;
    avgOrderValue: number;
  };
}

const AnalyticsMetrics = ({ analytics }: AnalyticsMetricsProps) => {
  const metrics = [
    {
      label: 'Gesamtumsatz',
      value: `€${analytics.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Bestellungen',
      value: analytics.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Neue Kunden',
      value: analytics.newCustomers.toString(),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Ø Bestellwert',
      value: `€${analytics.avgOrderValue.toFixed(2)}`,
      icon: BarChart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
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

export default AnalyticsMetrics;
