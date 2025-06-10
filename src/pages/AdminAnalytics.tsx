
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnalyticsMetrics from '@/components/admin/analytics/components/AnalyticsMetrics';
import AnalyticsCharts from '@/components/admin/analytics/components/AnalyticsCharts';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';

const AdminAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('30days');
  
  // Echtzeit-Updates aktivieren
  useRealtimeOrders();

  const { data: analytics, isLoading } = useAdminAnalytics(timeFilter);

  const timeFilterOptions = [
    { value: '7days', label: 'Letzte 7 Tage' },
    { value: '30days', label: 'Letzter Monat' },
    { value: '3months', label: 'Letzte 3 Monate' },
    { value: '12months', label: 'Letztes Jahr' },
    { value: 'all', label: 'Alle Zeit' },
  ];

  return (
    <AdminLayout>
      {/* Minimalistic Header */}
      <header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-foreground tracking-tight">Analytik</h1>
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-48 bg-background border-input">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              {timeFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Clean Content Area */}
      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
          
          {/* Key Metrics Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-foreground">Überblick</h2>
              <p className="text-sm text-muted-foreground">
                Wichtige Kennzahlen für {timeFilterOptions.find(o => o.value === timeFilter)?.label.toLowerCase()}
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />
                ))}
              </div>
            ) : analytics ? (
              <AnalyticsMetrics analytics={analytics} />
            ) : null}
          </section>

          {/* Charts Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-foreground">Trends</h2>
              <p className="text-sm text-muted-foreground">
                Detaillierte Einblicke in die Entwicklung
              </p>
            </div>
            
            {analytics && <AnalyticsCharts analytics={analytics} timeFilter={timeFilter} />}
          </section>
          
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminAnalytics;
